import { computed, react } from '../reactive';

describe('test computed method', () => {
    it('should computed normally works', function() {
        const you = react({
            name: 'liming',
            dog: {
                name: 'ketty'
            }
        });

        const dogName = computed(() => you.dog.name);
        const yourName = computed(() => you.name);

        you.dog.name = 'ketty1';
        you.name = 'wangming';

        expect(dogName.value).toBe('ketty1');
        expect(yourName.value).toBe('wangming');
    });
});