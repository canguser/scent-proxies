const originProxyMap = new WeakMap();
const originReadonlyMap = new WeakMap();
const proxyOriginMap = new WeakMap();
const originParentsMap = new WeakMap();
const originSubscribeMap = new WeakMap();
const refOriginMap = new WeakMap();
const proxyRefSubscribesMap = new WeakMap();

let globalSubscribes = [];
const globalHandler = {
    get(...args) {
        for (const handler of globalSubscribes) {
            if (typeof handler.get === 'function') {
                handler.get(...args);
            }
        }
    },
    set(...args) {
        for (const handler of globalSubscribes) {
            if (typeof handler.set === 'function') {
                handler.set(...args);
            }
        }
    }
};

export class Subscriber {


    constructor(private reactiveObject, private handler) {
        if (reactiveObject === 'all') {
        } else if (!isReactive(reactiveObject)) {
            throw new TypeError('Must subscribe reactive obj');
        }
        this.start();
    }

    get target() {
        return this.reactiveObject === 'all' ? null : this.reactiveObject;
    }

    public start() {
        _addSubscribe(this.target, this.handler);
    }

    public stop() {
        _removeSubscribe(this.target, this.handler);
    }

}

function _addSubscribe(obj, handler) {
    obj = getOrigin(obj);
    if (handler) {
        if (obj) {
            const subscribes = originSubscribeMap.get(obj) || [];
            if (!subscribes.includes(handler)) {
                subscribes.push(handler);
                originSubscribeMap.set(obj, subscribes);
            }
        } else {
            if (!globalSubscribes.includes(handler)) {
                globalSubscribes.push(handler);
            }
        }
    }
}

function _removeSubscribe(obj, handler) {
    obj = getOrigin(obj);
    if (handler) {
        if (obj) {
            const subscribes = originSubscribeMap.get(obj) || [];
            if (subscribes.includes(handler)) {
                originSubscribeMap.set(obj, subscribes.filter(h => h !== handler));
            }
        } else {
            if (globalSubscribes.includes(handler)) {
                globalSubscribes = globalSubscribes.filter(h => h !== handler);
            }
        }
    }
}

function _invokeGetter(obj) {
}

export function _getMaps() {
    return [
        originSubscribeMap
    ];
}

let notifyStack: Array<any[]> = [];

function _hasNotified(...args) {
    return notifyStack.some(
        as => args.every((a, i) => a === as[i])
    );
}

function _clearNotifyStack(...args) {
    for (let i = 0; i < notifyStack.length; i++) {
        const notifyArgs = notifyStack[i];
        if (args.every((a, i) => a === notifyArgs[i])) {
            notifyStack.splice(i, 1);
            return;
        }
    }
}

function _notifyOriginParents(origin, type, property, ...args) {

    const allArgs = [origin, type, property, ...args];

    if (_hasNotified(...allArgs)) {
        return;
    }

    notifyStack.push(allArgs);
    try {
        const parents: any[] = _getOriginParentsWithChain(origin, [property]);
        parents.push({ parent: origin, propertyChain: property });
        for (const { parent, propertyChain } of parents) {
            const subscribes = originSubscribeMap.get(parent) || [];
            for (const subscribe of subscribes) {
                if (subscribe && typeof subscribe[type] === 'function') {
                    subscribe[type](getReact(parent), propertyChain, ...args);
                }
            }
        }
    } finally {
        notifyStack.pop();
    }

}

function _getOriginParents(origin: object): any[] {
    if (originParentsMap.has(origin)) {
        return originParentsMap.get(origin) || [];
    }
    return [];
}

function _getOriginParentsWithChain(origin: any, extraChild = []): any[] {
    const parents = _getOriginParents(origin);
    const results = parents.map(p => ({
        parent: p.parent,
        propertyChain: [p.parentProperty, ...extraChild].join('.')
    }));
    return results.concat(parents.map(p => _getOriginParentsWithChain(p.parent, [p.parentProperty, ...extraChild])).flat());
}

function _initGlobalSubscriber(origin) {
    _addSubscribe(origin, globalHandler);
}

function _removeOriginParent(origin, parent, parentProperty) {
    if (parent != null) {
        const parents = originParentsMap.get(origin) || [];
        const targetParent = parents.find(p => p.parent === parent && p.parentProperty === parentProperty);
        if (targetParent) {
            const index = parents.indexOf(targetParent);
            parents.splice(index, 1);
        }
    }
}

function _addOriginParent(origin, parent, parentProperty) {
    if (parent != null) {
        const parents = originParentsMap.get(origin) || [];
        if (parents.some(p => p.parent === parent && p.parentProperty === parentProperty)) {
            return;
        }
        parents.push({
            parent,
            parentProperty
        });
        originParentsMap.set(origin, parents);
    } else {
        _initGlobalSubscriber(origin);
    }
}

function _readonly(obj) {

}

export function unwrapProxies(target, deeply = true) {
    if (typeof target === 'object') {
        target = getOrigin(target);
        for (const key of Object.keys(target)) {
            let propertyValue = target[key];
            if (isReactive(propertyValue)) {
                linkProperty(target, key, propertyValue);
                propertyValue = getOrigin(propertyValue);
            }
            target[key] = propertyValue;
            if (typeof propertyValue === 'object' && deeply) {
                unwrapProxies(propertyValue, deeply);
            }
        }
    }
}

export function react(origin) {
    unwrapProxies(origin);
    return _react(origin);
}

function _react(origin) {
    origin = getOrigin(origin);
    const proxy = originProxyMap.get(origin) || new Proxy(origin, {
        get(target: any, p: string | symbol): any {
            return getProperty(target, p);
        },
        set(target: any, p: string | symbol, value: any): boolean {
            return linkProperty(target, p, value);
        }
    });
    originProxyMap.set(origin, proxy);
    proxyOriginMap.set(proxy, origin);
    return proxy;
}

export function getProperty(target, property, notify = true) {
    if (typeof target == 'object') {
        target = getOrigin(target);
        let value = Reflect.get(target, property);
        if (typeof value === 'object') {
            _addOriginParent(value, target, property);
            value = getReact(value);
        }
        if (notify) {
            _notifyOriginParents(target, 'get', property, getOrigin(value));
        }
        return value;
    }
}

export function linkProperty(target, property, value, notify = true) {
    if (typeof target == 'object') {
        target = getOrigin(target);
        const old = Reflect.get(target, property);

        if (typeof value === 'object') {
            value = getOrigin(value);
            if (typeof old === 'object') {
                _removeOriginParent(old, target, property);
            }
            _addOriginParent(value, target, property);
        }

        const setResult = Reflect.set(target, property, value);

        if (notify && setResult) {
            _notifyOriginParents(target, 'set', property, value, old);
        }

        return setResult;
    }
    return false;
}

export function linkRef(obj, property, ref, notify = true): boolean {
    if (isRef(ref)) {
        obj = getReact(obj);

        const map = proxyRefSubscribesMap.get(obj) || {};
        let subscribers = map[property] || [];

        for (const subscriber of subscribers) {
            subscriber.stop();
        }

        const setResult = Reflect.set(notify ? obj : getOrigin(obj), property, getRefValue(ref));

        if (setResult) {
            const refProperty = getRefProperty(ref);
            const refSubscriber = subscribe(ref, refProperty, {
                set: (target, p, value, old) => {
                    if (value !== old) {
                        obj[property] = value;
                    }
                },
                get: () => {
                    _invokeGetter(obj[property]);
                }
            });
            const reactSubscriber = subscribe(obj, property, {
                set: (target, p, value, old) => {
                    if (value !== old) {
                        ref[refProperty] = value;
                    }
                },
                get: () => {
                    _invokeGetter(ref[refProperty]);
                }
            });

            subscribers = [refSubscriber, reactSubscriber];
            map[property] = subscribers;
            proxyRefSubscribesMap.set(obj, map);
            return true;
        }
        return false;
    }
    return false;
}

export function ref(value, property = 'value') {
    const origin = { [property]: value };
    const ref = react(origin);
    refOriginMap.set(ref, { origin: origin, property });
    return ref;
}

export function isRef(obj) {
    return refOriginMap.has(obj);
}

export function getRefProperty(obj) {
    if (!isRef(obj)) {
        throw new TypeError(`obj is not the ref.`);
    }
    return refOriginMap.get(obj).property;
}

export function getRefValue(obj) {
    return obj[getRefProperty(obj)];
}

export function computed(options) {
    let getter, setter, property = 'value';

    if (typeof options === 'function') {
        getter = options;
    } else if (typeof options === 'object') {
        getter = options.get || (() => undefined);
        if (typeof options.set === 'function') {
            setter = options.set;
        }
        if (options.property) {
            property = options.property;
        }
    }

    const effectList = [];
    const subscriber = subscribe('all', {
        get(target, propertyChain) {
            effectList.push({
                target,
                propertyChain
            });
        }
    });
    const initValue = getter();
    subscriber.stop();
    const computedObj = ref(initValue, property);
    for (const { target, propertyChain: pc } of effectList) {
        subscribe(target, pc, {
            set() {
                computedObj[property] = getter();
            }
        });
    }
    if (typeof setter === 'function') {
        subscribe(computedObj, property, {
            set(target, p, value, old) {
                setter(value, old);
            }
        });
    }
    return computedObj;
}

export function isReactive(obj) {
    return proxyOriginMap.has(obj);
}

export function getOrigin(obj) {
    return proxyOriginMap.get(obj) || obj;
}

export function getReact(obj) {
    return originProxyMap.get(obj) || react(obj);
}

function _parsedPropertyHandler(propertyChain, handler = {}) {
    return Object.entries(handler).reduce((h, [type, value]) => {
        h[type] = function(target, pc, ...args) {
            if (typeof value === 'function' && pc === propertyChain) {
                value.call(this, target, pc, ...args);
            }
        };
        return h;
    }, {});
}

export function subscribe(obj, ...args) {
    let handler, propertyChain;
    handler = args[args.length - 1];
    if (args.length > 1) {
        propertyChain = args[0];
    }
    if (propertyChain == null && isRef(obj)) {
        propertyChain = getRefProperty(obj);
    }
    if (propertyChain != null) {
        handler = _parsedPropertyHandler(propertyChain, handler || {});
    }
    return new Subscriber(obj, handler);
}
