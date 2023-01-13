/** @noSelfInFile **/

import { Arr } from '../../lib/array';
import { Effect, EffectCallback, registerEffect, triggerEffects } from './effect';

export const weakRefKey = '__reactivity__';
export const originKey = '__reactivity_origin__';
export const isReactivityFlag = '___isReactivity';
export const effectKey = '___effectIds';

export const options = {
    noThrottle: false
};

const specifiedKeys = [weakRefKey, originKey, isReactivityFlag, effectKey];

export type ReactivityWrapper<T extends object = object> = T & {
    ___isReactivity?: true;
};

export type RefValue<T = any> = { value: T } & {
    ___isRef?: true;
};

// function proxy<T extends object>(target: T, handler: ProxyHandler<T>, origin: object = {}): T {
//     const result = origin as T;
//     setmetatable(result, {
//         // @ts-ignore
//         __index: function (this: void, t, k) {
//             return handler.get(target, k, t);
//         },
//         __newindex: function (this: void, t, k, v) {
//             return handler.set(target, k, v, t);
//         }
//     });
//     return result;
// }


const log = {
    debug : (...args) => console.log(...args),
    error : (...args) => console.error(...args)
};
function proxy<T extends object>(
    target: T,
    handler: ProxyHandler<T>,
    origin: object = {}
): T {
    const result = new Proxy(origin as T, {
        get: (target, p: string) => {
            if (p in origin) {
                return origin[p];
            }
            return handler.get(target, p, result);
        },
        set: (target, p: string, value) => {
            if (p in origin) {
                return true;
            }
            handler.set(target, p, value, result);
            return true
        },
    });
    return result;
}

export function isReactivity(obj: any): obj is ReactivityWrapper {
    return obj && typeof obj === 'object' && obj['___isReactivity'] === true;
}

export function isRef(obj: any): obj is RefValue {
    return obj && typeof obj === 'object' && obj['___isRef'] === true;
}

let beingEffect: Effect = null

export function watchEffect(effect: EffectCallback): Effect {
    const effObj = new Effect((eff)=>{
        eff.clear()
        try {
            beingEffect = eff
            effect(eff)
        } catch (err) {
            log.error(err)
        } finally{
            beingEffect = null;
        }

    }, {
        immediate:(eff: Effect)=>{
            try {
                beingEffect = eff
                effect(eff)
            } catch (err) {
                log.error(err)
            } finally{
                beingEffect = null;
            }
        },
        throttle: !options.noThrottle
    });
    effObj.start()
    return effObj
}


export function clearEffect(this: any, effect: Effect) {
    effect.clear()
}

export function clearEffects(effects: Effect[]) {
    effects.forEach(clearEffect);
}

export function reactivity<T extends object>(obj: T): ReactivityWrapper<T> {
    if (isReactivity(obj) || isRef(obj)) {
        return obj;
    }
    if (obj[weakRefKey]) {
        return obj[weakRefKey];
    }
    const proxyObj = proxy<ReactivityWrapper<T>>(obj as ReactivityWrapper<T>, {
        get(target, key: string) {
            if (key === isReactivityFlag) {
                return true;
            }
            if (key === originKey) {
                return obj;
            }
            if (key === weakRefKey) {
                return null;
            }
            const effectOpt = beingEffect;
            if (effectOpt) {
                registerEffect(obj, key as any, effectOpt);
            }
            let result = obj[key];
            if (typeof result == 'object') {
                result = reactivity(result);
            }
            return result;
        },
        set(target, key: string, value) {
            if (key === weakRefKey) {
                return true;
            }
            const oldValue = obj[key];
            if (oldValue !== value) {
                obj[key] = value;
                triggerEffects(obj, key as any);
            }
            return true;
        }
    });
    obj[weakRefKey] = proxyObj;
    return proxyObj;
}

export function ref<T>(value: T): RefValue<T> {
    const reactObj = reactivity({ value });
    const result = { ___isRef: true };
    Object.defineProperty(result, 'value', {
        get: () => reactObj.value,
        set: (v) => {
            reactObj.value = v;
        }
    });
    return result as RefValue<T>;
}

export function getRefValue<T>(ref: RefValue<T> | T): T {
    if (ref && isRef(ref)) {
        return (ref as RefValue<T>).value;
    }
    return ref as T;
}

export function toRaw<T extends object>(obj: ReactivityWrapper<T>): T {
    if (isReactivity(obj)) {
        return obj[originKey];
    }
    return obj;
}

export function keys<T extends object>(obj: T): (keyof T)[] {
    if (isReactivity(obj)) {
        const keys = Object.keys(toRaw(obj)) as (keyof T)[];
        // remove weakKey
        return keys.filter((key) => !specifiedKeys.includes(key as string));
    }
    return Object.keys(obj) as (keyof T)[];
}

export type Refs<T> = {
    [key: string]: RefValue<T>;
};

export function toRef<T extends object, K extends keyof T>(obj: ReactivityWrapper<T>, key: K): RefValue<T[K]> {
    const result = { ___isRef: true };
    Object.defineProperty(result, 'value', {
        get: () => {
            if (Arr.isArr(toRaw(obj))) {
                return obj[key];
            }
            if (Array.isArray(obj) && typeof key === 'number') {
                // make ts2lua engine known obj is array
                return obj[key];
            }
            return obj[key];
        },
        set: (v) => {
            if (Arr.isArr(toRaw(obj))) {
                obj[key] = v;
            } else if (Array.isArray(obj) && typeof key === 'number') {
                // make ts2lua engine known obj is array
                obj[key] = v;
            } else {
                obj[key] = v;
            }
        }
    });
    return result as RefValue<T[K]>;
}

export function toRefs<T extends object>(obj: ReactivityWrapper<T>): Refs<T[keyof T]> {
    const result: any = {};
    for (const key of keys(obj)) {
        result[key] = toRef(obj, key as any);
    }
    return result;
}

export function computed<T>(fn: (this: void) => T): RefValue<T> {
    const computed: ReactivityWrapper<{ value: T }> = reactivity({ value: null });
    watchEffect(() => {
        computed.value = fn();
    });
    return toRef(computed, 'value');
}
