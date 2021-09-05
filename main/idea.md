```javascript

/**
 * react()
 */

const obj = {}

const a = react(obj);

isReactive(a)

const subscriber = subscribe(a, {

    get(propertyChain, value){

    },

    set(propertyChain, value, oldValue){

    }

})

// stop subscribe
subscribe.destroy();

const normalObj = getOrigin(a);
console.assert(obj === normalObj);

```