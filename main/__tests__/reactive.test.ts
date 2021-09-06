import { react, ref, subscribe } from '../reactive';

function assert() {
    expect(1).toBe(1);
}

describe('', () => {

    it('should test', function() {
        const a = react({ a: 1 });
    });

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

    it('should link ref (react object) - 01', function() {
        const dog = react({
            name: 'kitty',
            age: 5
        });

        function assert() {
            expect(1).toBe(1);
        }

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
            get: assert, // 1
            set: assert  // 0
        });

        const you = react({
            name: 'Li Ming'
        });

        subscribe(you, {
            get: assert, // 3
            set: assert  // 2
        });

        you.dog = dogRef;

        dog.name = 'monkey';

        // 3
        expect(dog.name).toBe('monkey');
        expect(dogRef.value.name).toBe('monkey');
        expect(you.dog.name).toBe('monkey');


        expect.assertions(
            3 + 1 +     // dog
            1 +         // dog ref
            3 + 2 +     // you
            3           // expect
        );
    });
});