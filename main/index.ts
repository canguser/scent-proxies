export * from './utils/property-chain';
export * from './reactive'

/*

const a = react(obj);

1.

const watcher = watchSetter(a, (property, old, value)=>{
    console.log(property) // a.b.c.d
})

watcher.entity // > a

watcher.cancel();

2.

const obj = unProxy(a);

3.

a.a = a.b = {}

console.log(a.a === a.b) // true

4.

a.urlName = link(()=>a.url.name)

console.log(a.urlName)

5.

const watcher = watchGetter(a, (property, value)=>{

})

6.

const sb = subscribe(a, 'a.j.d', ()=>{

})

 */

/*

const proxy = new DeeplyProxy(obj, {
    get(target, propertyChain){

    },
    set(target, propertyChain, value){

    }
});



 */