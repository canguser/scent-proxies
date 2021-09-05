export function parseChain(chain): Array<string | symbol> {
    if (typeof chain === 'string') {
        return chain.split('.')
            .map(c => c.trim());
    }
    if (Array.isArray(chain)) {
        return [...chain];
    }
    return [chain];
}

export function get(target, propertyChain) {
    propertyChain = parseChain(propertyChain);
    if (target == null) {
        throw new TypeError(`Can\'t get ${propertyChain.join('.')} of ${target}`);
    }
    if (propertyChain.length === 0) {
        return target;
    }
    if (propertyChain.length === 1) {
        return target[propertyChain[0]];
    }
    const nextProperty = propertyChain.splice(0, 1);
    let nextTarget = target[nextProperty] || {};
    return get(nextTarget, propertyChain);
}

export function set(target, propertyChain, value) {
    propertyChain = parseChain(propertyChain);
    if (target == null) {
        throw new TypeError(`Can\'t set ${propertyChain.join('.')} of ${target}`);
    }
    if (propertyChain.length === 0) {
        return false;
    }
    if (propertyChain.length === 1) {
        return Reflect.set(target, propertyChain[0], value);
    }
    const nextProperty = propertyChain.splice(0, 1);
    let nextTarget = target[nextProperty];
    if (nextTarget == null) {
        nextTarget = /^[0-9]+$/.test(nextProperty) ? [] : {};
        target[nextProperty] = nextTarget;
    }
    return set(nextTarget, propertyChain, value);
}

export function has(target, propertyChain) {

}