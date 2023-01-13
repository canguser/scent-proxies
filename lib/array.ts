export class Arr<T> {
    [key: number]: T;
    _length: number = 0;

    get length(): number {
        return this._length;
    }

    constructor(...args: T[]) {
        this.push(...args);
    }

    // push
    push(...items: T[]): number {
        for (let i = 0; i < items.length; i++) {
            this[this.length] = items[i];
            this._length++;
        }
        return this.length;
    }

    // pop
    pop(): T | undefined {
        if (this.length > 0) {
            this._length--;
            const value = this[this.length];
            delete this[this.length];
            return value;
        }
    }

    // shift
    shift(): T | undefined {
        if (this.length > 0) {
            const value = this[0];
            for (let i = 0; i < this.length - 1; i++) {
                this[i] = this[i + 1];
            }
            this._length--;
            delete this[this.length];
            return value;
        }
    }

    // unshift
    unshift(...items: T[]): number {
        for (let i = 0; i < items.length; i++) {
            for (let j = this.length; j > 0; j--) {
                this[j] = this[j - 1];
            }
            this[0] = items[i];
            this._length++;
        }
        return this.length;
    }

    // slice
    slice(start: number, end?: number): Arr<T> {
        const arr = new Arr<T>();
        if (end === undefined) {
            end = this.length;
        }
        for (let i = start; i < end; i++) {
            arr.push(this[i]);
        }
        return arr;
    }

    // splice
    splice(start: number, deleteCount?: number, ...items: T[]): Arr<T> {
        const arr = new Arr<T>();
        if (deleteCount === undefined) {
            deleteCount = this.length - start;
        }
        for (let i = 0; i < deleteCount; i++) {
            arr.push(this[start + i]);
        }
        for (let i = 0; i < deleteCount; i++) {
            this.shift();
        }
        for (let i = 0; i < items.length; i++) {
            this.unshift(items[i]);
        }
        return arr;
    }

    // map
    map<U>(
        callback: (this: void, value: T, index: number, array: Arr<T>) => U
    ): Arr<U> {
        const arr = new Arr<U>();
        for (let i = 0; i < this.length; i++) {
            arr.push(callback(this[i], i, this));
        }
        return arr;
    }

    // forEach
    forEach(
        callback: (this: void, value: T, index: number, array: Arr<T>) => void
    ): void {
        for (let i = 0; i < this.length; i++) {
            callback(this[i], i, this);
        }
    }

    // filter
    filter(
        callback: (
            this: void,
            value: T,
            index: number,
            array: Arr<T>
        ) => boolean
    ): Arr<T> {
        const arr = new Arr<T>();
        for (let i = 0; i < this.length; i++) {
            if (callback(this[i], i, this)) {
                arr.push(this[i]);
            }
        }
        return arr;
    }

    // find
    find(
        callback: (
            this: void,
            value: T,
            index: number,
            array: Arr<T>
        ) => boolean
    ): T | undefined {
        for (let i = 0; i < this.length; i++) {
            if (callback(this[i], i, this)) {
                return this[i];
            }
        }
    }

    // join
    join(separator?: string): string {
        let str = "";
        for (let i = 0; i < this.length; i++) {
            if (i === this.length - 1) {
                str += this[i];
            } else {
                str += this[i] + separator;
            }
        }
        return str;
    }

    static isArr<T>(this: void, value: any): value is Arr<T> {
        return value instanceof Arr;
    }

    static len(this:void, arr: Arr<any>): number {
        return arr.length;
    }
}

export function toArr<T>(arr: T[]): Arr<T> {
    return new Arr<T>(...arr);
}