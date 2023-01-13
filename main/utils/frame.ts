let frameCallbacks: ((this: void) => boolean)[] = [];
let hasRegisterFrame = false
let afterCallbacks: ((this: void) => boolean)[] = [];

function onFrameCallback(){
    frameCallbacks = frameCallbacks.filter((callback) => callback());
    afterCallbacks = afterCallbacks.filter((callback) => callback());
}

export function onFrameRefresh(this:void, cb: (this:void)=>boolean){
    frameCallbacks.push(cb);
    if (!hasRegisterFrame){
        setInterval(onFrameCallback, 0.01)
        // DzFrameSetUpdateCallbackByCode(onFrameCallback)
    }
}

export function afterFrameRefresh(this:void, cb: (this:void)=>boolean){
    afterCallbacks.push(cb);
}

export function nextFrame(this: void, callback: (this: void) => void) {
    onFrameRefresh(() => {
        callback();
        return false;
    });
}

export function nextTick(this: void, callback: (this: void) => void) {
    afterFrameRefresh(() => {
        callback();
        return false;
    });
}