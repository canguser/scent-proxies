const { react, subscribe, computed, ref } = window.scent.proxies;

const obj = { a: 1, b: { c: 1, d: { e: 2 } } };

const proxy = react(obj);

const abde = computed({
    get() {
        return proxy.b.d.e;
    },
    set(value) {
        console.log(`abde, set`, value);
    }
});

subscribe(abde, {
    set(target, property, value, old) {
        console.log('abde changed', `${old} => ${value}`);
    }
});