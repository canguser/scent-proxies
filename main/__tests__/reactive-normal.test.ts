import { react, ref, subscribe, unwrapProxies } from '../reactive';

function assert() {
    expect(1).toBe(1);
}


describe('reactive.ts - normal', () => {

    it('should correctly unwrap obj', function() {

        const dog = {
            hobby: react([
                'game', 'food'
            ]),
            birth: {
                where: {
                    long_lat: react(['123123.234234', '523423.53423'])
                }
            }
        };

        unwrapProxies(dog);

        expect(dog.hobby[0]).toBe('game');
        expect(dog.hobby[1]).toBe('food');
        expect(dog.birth.where.long_lat[0]).toBe('123123.234234');
        expect(dog.birth.where.long_lat[1]).toBe('523423.53423');

    });

    it('should notify assigned parent', function() {

        const dog = react({ name: 'kitty' });
        const you = react({});

        you.dog = dog;

        subscribe(you, {
            get: assert, // > 1
            set: assert // > 1
        });

        dog.name;

        dog.name = 'kitty1';

        expect.assertions(2);

    });

    it('should using react on initial', function() {
        const you = react({
            dog: react({
                name: 'kitty'
            })
        });

        subscribe(you, {
            get: assert, // > 2 + 1 + 2
            set: (target, p, value, old) => {
                expect(p).toBe('dog.name');
                expect(value).toBe('kitty1');
                expect(old).toBe('kitty');
                assert();
            }  // > 3 + 1
        });

        expect(you.dog.name).toBe('kitty'); // getter 2

        you.dog.name = 'kitty1'; // getter 1 (.dog), setter 1

        expect(you.dog.name).toBe('kitty1'); // getter 2

        expect.assertions((2 + 1 + 2) + (3 + 1) + (1 + 1));

    });

    it('should test global subscriber', function() {
        subscribe('all', {
            get: assert, // 1 + 2 + 2
            set: assert // 1 + 1 + 1 + 1
        });

        const you = react({
            dog: react({
                name: 'kitty'
            })
        });

        const cat = react({
            name: 'sandao'
        });

        cat.name = 'sandao0';

        you.cat = cat;


        you.dog.name = 'kitty1';

        cat.name = 'sandao1';

        expect(you.cat.name).toBe('sandao1');
        expect(you.dog.name).toBe('kitty1');

        expect.assertions(5 + 4 + 2);


    });

});