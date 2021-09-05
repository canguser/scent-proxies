export declare class Subscriber {
    private reactiveObject;
    private handler;
    constructor(reactiveObject: any, handler: any);
    start(): void;
    stop(): void;
}
export declare function _notifyOriginParents(origin: any, type: any, property: any, ...args: any[]): void;
export declare function _getOriginParents(origin: object): any[];
export declare function _getOriginParentsWithChain(origin: any, extraChild?: any[]): any[];
export declare function react(origin: any): any;
export declare function isReactive(obj: any): boolean;
export declare function getOrigin(obj: any): any;
export declare function subscribe(obj: any, handler: any): Subscriber;
