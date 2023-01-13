// import { nextFrame } from "../../utils/frame";
import { nextFrame } from "../utils/frame";


export type EffectCallback = (this: void, effect: Effect) => any;


export interface EffectOption {
    active?: boolean;
    // 立即执行的函数
    immediate?: EffectCallback;
    // 节流到下一帧执行
    throttle?: boolean;
}


export class EffectManager {
    private _effects: Effect[] = [];

    // 双向添加效果
    public addEffect(effect: Effect) {
        if (!this._effects.includes(effect)) {
            this._effects.push(effect);
        }
        effect.registerManager(this);
    }

    // 移除效果，可选是否双向移除
    public removeEffect(effect: Effect, unregister: boolean = false) {
        const index = this._effects.indexOf(effect);
        if (index >= 0) {
            this._effects.splice(index, 1);
            if (unregister){
                effect.unregisterManager(this);
            }
        }
    }

    // 双向移除当前所有的效果
    public clearEffects(){
        this._effects.forEach(effect => {
            effect.unregisterManager(this);
        });
        this._effects = [];
    }

    /**
     * 执行所有效果
     */
    public runEffects(){
        this._effects.slice(0).forEach(effect => {
            if (effect.active){
                effect.run();
            }
        });
    }
}

export class Effect {
    private _managers: EffectManager[] = [];
    public active: boolean = true
    public readonly immediate: EffectCallback = null
    public readonly throttle: boolean = true

    private waitThrottle: boolean = false

    constructor(public schedule: EffectCallback, options?: EffectOption){
        this.immediate = options?.immediate
        this.active = options?.active ?? true
        this.throttle = options?.throttle ?? true
    }

    /**
     * 单向注册效果管理器，一般在管理器中调用
     */
    public registerManager(manager: EffectManager) {
        if (!this._managers.includes(manager)){
            this._managers.push(manager);
        }
    }

    /**
     * 单向移除效果管理器，一般在管理器中调用
     */
    public unregisterManager(manager: EffectManager) {
        const index = this._managers.indexOf(manager);
        if (index >= 0) {
            this._managers.splice(index, 1);
        }
    }

    /**
     * 双向移除该效果的所有效果管理器
     */
    public clear() {
        this._managers.forEach(manager => {
            manager.removeEffect(this);
        });
        this._managers = []
    }

    /**
     * 执行效果
     */
    public run(immediate: boolean = false) {
        if (!immediate && this.throttle){
            if (!this.waitThrottle){
                this.waitThrottle = true
                nextFrame(() => {
                    this.waitThrottle = false;
                    this.schedule(this);
                });
            }
            return
        }
        this.schedule(this);
    }

    public stop(){
        this.active = false
    }

    public start(){
        this.active = true
        if (this.immediate){
            this.immediate(this)
        }
    }

}

export type ObjectEffectManager<T extends object> = {
    [key in keyof T]: EffectManager
}

const objectEffectManagerWeakMap = new WeakMap<object, ObjectEffectManager<object>>()

function loadObjectEffectManager<T extends object>(target: T): ObjectEffectManager<T> {
    if (objectEffectManagerWeakMap.has(target)){
        return objectEffectManagerWeakMap.get(target) as ObjectEffectManager<T>
    }
    const manager: ObjectEffectManager<T> = {} as ObjectEffectManager<T>
    objectEffectManagerWeakMap.set(target, manager)
    return manager
}

export function registerEffect<T extends object>(target: T, key: keyof T, effect: Effect) {
    const manager = loadObjectEffectManager(target)
    if (!manager[key]){
        manager[key] = new EffectManager()
    }
    manager[key].addEffect(effect)
}

export function unregisterEffect<T extends object>(target: T, key: keyof T, effect: Effect) {
    const manager = loadObjectEffectManager(target)
    if (manager[key]){
        manager[key].removeEffect(effect, true)
    }
}

export function triggerEffects<T extends object>(target: T, key: keyof T) {
    const manager = loadObjectEffectManager(target)
    if (manager[key]){
        // @ts-ignore
        manager[key].runEffects()
    }
}