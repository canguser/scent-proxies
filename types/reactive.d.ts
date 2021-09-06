export declare class Subscriber {
    private reactiveObject;
    private handler;
    constructor(reactiveObject: any, handler: any);
    get target(): any;
    start(): void;
    stop(): void;
}
export declare function _getMaps(): WeakMap<object, any>[];
export declare function linkRef(obj: any, property: any, ref: any): void;
export declare function react(origin: any, isShallow?: boolean): any;
export declare function ref(value: any, property?: string): any;
export declare function isRef(obj: any): boolean;
export declare function getRefProperty(obj: any): any;
export declare function getRefValue(obj: any): any;
export declare function computed(options: any): any;
export declare function isReactive(obj: any): boolean;
export declare function getOrigin(obj: any): any;
export declare function getReact(obj: any, isShallow?: boolean): any;
export declare function subscribe(obj: any, ...args: any[]): Subscriber;
