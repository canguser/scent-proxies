import { computed, options, reactivity, ref, toRefs, watchEffect } from '../main/reactivity';
import { nextTick } from '../utils/frame';

describe('test reactivity', () => {

    // test setup
    options.noThrottle = true

    it('should reactivity works', function() {
        const a = reactivity({
            value: 100
        })

        let b = 1

        watchEffect(()=>{
            b = a.value
            console.log("test",b)
        })

        expect(b).toBe(100)

        a.value = 999

        console.log('a.value',a.value)
        expect(b).toBe(999)
    });

    it('should deep object works', function() {
        const a = reactivity({
            value: {
                aceMode: 100
            }
        })

        let b = 1

        watchEffect(()=>{
            b = a.value.aceMode
            console.log('b',b)
        })

        expect(b).toBe(100)

        a.value.aceMode = 999

        console.log(a.value.aceMode)

        expect(b).toBe(999)
    });

    it('should test ref', function() {
        const a = ref(999)
        let b = 0
        watchEffect(()=>{
            b = a.value
        })
        expect(b).toBe(999)
        a.value = 555
        expect(b).toBe(555)
    });

    it('should test to refs', function() {
        const a = reactivity({
            b: 100,
            c: 200,
            d: 300
        })
        const {b, c, d} = toRefs(a)

        let bb = 0, cc = 0, dd = 0

        watchEffect(()=>{
            bb = a.b
            cc = a.c
            dd = a.d
        })

        expect(bb).toBe(100)
        expect(cc).toBe(200)
        expect(dd).toBe(300)

        b.value = 999
        c.value = 888
        d.value = 777

        expect(bb).toBe(999)
        expect(cc).toBe(888)
        expect(dd).toBe(777)
    });

    it('should test multi - 0', function() {
        const a = reactivity({
            a:1
        })

        let b = 0, c = 0

        watchEffect(()=>{
            console.log('+2')
            b = a.a + 2
        })

        watchEffect(()=>{
            console.log('+3')
            c = a.a + 3
        })

        expect(b).toBe(3)
        expect(c).toBe(4)

        a.a = 999

        expect(b).toBe(1001)
        expect(c).toBe(1002)

    });

    it('should test multi', function() {
        const a = reactivity({
            b: 100,
            c: 200,
            d: 300,
            e: true
        })

        let ff = ''

        watchEffect(()=>{
            ff = a.b+""+a.c+ "" + a.d
        })

        expect(ff).toBe('100200300')

        watchEffect(()=>{
            if(a.e){
                a.b = 999
            }
            else{
                a.b = 888
            }
        })

        expect(ff).toBe('999200300')

        a.e = false

        expect(ff).toBe('888200300')

        watchEffect(()=>{
            if (a.e){
                a.c = 777
            }
            else{
                a.c = 666
            }
        })

        expect(ff).toBe('888666300')

        a.e = true

        expect(ff).toBe('999777300')
    });

    it('should test computed', function() {
        const a = reactivity({
            b: 100,
            c: 200,
            d: 300,
            e: true
        })

        const name = computed(()=>`${a.b} ${a.c} ${a.d} ${a.e}`)

        expect(name.value).toBe('100 200 300 true')

        a.b = 999

        expect(name.value).toBe('999 200 300 true')

        a.e = false
        a.c = 888

        expect(name.value).toBe('999 888 300 false')
    });

    it('should test throttle', async function() {

        options.noThrottle = false

        expect.assertions(3)

        const waitTick = () => {
            return new Promise(resolve => {
                nextTick(resolve as any)
            })
        }
        const a = reactivity({
            b: 100,
            c: 200,
            d: 300,
            e: true
        })

        const name = computed(()=>{
            expect(1).toBe(1)
            return `${a.b} ${a.c} ${a.d} ${a.e}`
        })

        a.b = 999
        a.e = false
        a.c = 888

        await waitTick()
        expect(name.value).toBe('999 888 300 false')
    })
});