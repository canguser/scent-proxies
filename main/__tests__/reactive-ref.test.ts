import { isProxy, react, ref, subscribe } from '../reactive';

function assert() {
    expect(1).toBe(1);
}

describe('reactive.ts', () => {


    it('should link ref (normal object)', function() {
        const a = react({ a: 1 });

        const r = ref('hello');

        a.test = r;

        expect(a.test).toBe(r.value);

        let world = 'world';

        a.test = world;

        expect(a.test).toBe(world);
        expect(r.value).toBe(world);

        world = 'test';
        r.value = 'test';

        expect(a.test).toBe(world);
        expect(r.value).toBe(world);

        const r1 = ref('r1');

        a.test = r1;

        r1.value = 'r999';

        expect(r1.value).toBe('r999');
        expect(a.test).toBe('r999');
        expect(r.value).toBe(world);

        a.test = 'r1001';

        expect(r1.value).toBe('r1001');
        expect(a.test).toBe('r1001');
        expect(r.value).toBe(world);

        r.value = 'r-test';

        expect(r1.value).toBe('r1001');
        expect(a.test).toBe('r1001');
        expect(r.value).toBe('r-test');
    });

    it('should link ref (normal object) - 01', function() {
        const name = 'kitty';
        const nameRef = ref(name);
        const dog = react({});
        Object.assign(dog, { name: nameRef });

        expect(dog.name).toBe('kitty');
    });

    it('should link ref (normal object) - 02', function() {
        const name = 'kitty';
        const nameRef = ref(name);
        const dog = react({});
        Object.assign(dog, { name: nameRef });

        subscribe(dog, {
            get: assert, // 1
            set: assert  // 2
        });

        dog.name = 'kitty1';

        expect(nameRef.value).toBe('kitty1');// 1

        expect.assertions(4);
    });

    it('should link ref - getter - 01', function() {
        const dog = react({ name: 'kitty' });
        const dogRef = ref(dog);

        subscribe(dog, {
            get: assert
        });

        dogRef.value.name;

        expect.assertions(1);

    });

    it('should re-assign to other ref', function() {
        const name = ref('kitty');
        const name1 = ref('kitty1');

        const dog = react({});
        dog.name = name;

        dog.name = 'nuilla';

        expect(name.value).toBe('nuilla');

        dog.name = name1;

        expect(name.value).toBe('nuilla');

        dog.name = 'aura';

        expect(name.value).toBe('nuilla');
        expect(name1.value).toBe('aura');

    });

    it('should link ref - getter - 02', function() {
        const dog = react({ name: 'kitty' });
        const dogRef = ref(dog);
        const you = react({});
        you.dog = dogRef;

        subscribe(you, {
            get: assert
        });

        dogRef.value.name;

        expect.assertions(2);
    });

    it('should link ref - setter - 01', function() {
        const dog = react({ name: 'kitty' });
        const dogRef = ref(dog);

        subscribe(dogRef, {
            set: assert
        });

        const you = react({});
        you.dog = dogRef;

        you.dog = { name: 'lilia' }; // 1

        expect.assertions(1);
    });

    it('should link ref (react object) - 01', function() {
        const dog = react({
            name: 'kitty',
            age: 5
        });

        const dogRef = ref(dog);

        subscribe(dogRef, {
            get: assert,
            set: assert
        });

        expect(dogRef.value.name).toBe(dog.name);

        // ref can't listen sub object's change
        dog.name = 'kitty1';

        expect(dogRef.value.name).toBe('kitty1');
        expect(dog.name).toBe('kitty1');

        expect.assertions(3 + 2 + 0);

    });

    it('should link ref (react object) - 02', function() {
        const dog = react({
            name: 'kitty'
        });

        subscribe(dog, {
            get: assert, // 3
            set: assert  // 1
        });

        const dogRef = ref(dog);

        subscribe(dogRef, {
            get: assert, // 3
            set: assert  // 0
        });

        const you = react({
            name: 'Li Ming'
        });

        subscribe(you, {
            get: assert, // 5
            set: assert  // 2
        });

        // you: get 1
        // you: set 1
        you.dog = dogRef;

        // dog: set 1
        // you: set 1
        dog.name = 'monkey';

        // dog: get 1
        // dogRef: get 1
        // you: get 1
        expect(dog.name).toBe('monkey');

        // dogRef: get 1
        // dog: get 1
        // you: get 1
        expect(dogRef.value.name).toBe('monkey');

        // you: get 2
        // dog: get 1
        // dogRef: get 1
        expect(you.dog.name).toBe('monkey');

        // default 3

        expect.assertions(
            4 + 1 +     // dog
            2 +         // dog ref
            5 + 2 +     // you
            3           // expect
        );
    });

    it('should works for ref setter in react obj', function() {
        const name = ref('kitty');
        const dog = react({ name });

        dog.name = 'hit';
        expect(name.value).toBe('hit');

        name.value = 'kit';
        expect(dog.name).toBe('kit');

    });

    it('should works for ref getter in react obj', function() {
        const name = ref('kitty');
        const dog = react({ name });

        subscribe(dog, {
            get: assert, // > 1
            set: assert  // > 0
        });

        expect(name.value).toBe('kitty');

        expect.assertions(1 + 1);

    });

    // it('should works for ref getter / setter deeply in react obj', function() {
    //     const name = ref('kitty');
    //     const dog = react({ name });
    //
    //     expect(dog.name).toBe('kitty');
    //
    //
    //
    // });
});