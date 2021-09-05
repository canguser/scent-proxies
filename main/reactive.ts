const originProxyMap = new WeakMap();
const proxyOriginMap = new WeakMap();
const originParentsMap = new WeakMap();
const originSubscribeMap = new WeakMap();
const refOriginMap = new WeakMap();
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


function _notifyOriginParents(origin, type, property, ...args) {
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

function _react(origin, isShallow = false, parent?: object, parentProperty?: string | symbol) {

    origin = getOrigin(origin);
    parent = getOrigin(parent);

    _addOriginParent(origin, parent, parentProperty);

    const proxy = originProxyMap.get(origin) || new Proxy(origin, {
        get(target: any, p: string | symbol, receiver: any): any {
            let originValue;
            let value = originValue = Reflect.get(target, p, receiver);
            if (typeof value === 'object' && !isShallow) {
                value = _react(value, isShallow, target, p);
            }
            _notifyOriginParents(target, 'get', p, originValue);
            return value;
        },
        set(target: any, p: string | symbol, value: any, receiver: any): boolean {
            const old = Reflect.get(target, p, receiver);
            const setResult = Reflect.set(target, p, value, receiver);
            if (setResult) {
                _notifyOriginParents(target, 'set', p, value, old);
            }
            return setResult;
        }
    });

    originProxyMap.set(origin, proxy);
    proxyOriginMap.set(proxy, origin);
    return proxy;
}

export function react(origin, isShallow = false) {
    return _react(origin, isShallow);
}

export function ref(value, property = 'value') {
    const origin = { [property]: value };
    const ref = react(origin, true);
    refOriginMap.set(ref, { origin: origin, property });
    return ref;
}

export function computed(getter) {
    const effectList = [];
    const subscriber = subscribe('all', {
        get(target, propertyChain) {
            console.log(target, propertyChain);
            effectList.push({
                target,
                propertyChain
            });
        }
    });
    getter();
    subscriber.stop();
    const computedObj = ref(null, 'value');
    for (const { target, propertyChain: pc } of effectList) {
        subscribe(target, {
            set(target, propertyChain) {
                if (propertyChain === pc) {
                    computedObj.value = getter();
                }
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

export function getReact(obj, isShallow = false) {
    return originProxyMap.get(obj) || react(obj, isShallow);
}

export function subscribe(obj, handler) {
    return new Subscriber(obj, handler);
}