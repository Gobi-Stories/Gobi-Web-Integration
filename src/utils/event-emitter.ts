export default class SimpleEventEmitter {
    private readonly _eventsCallbacks:{[key:string]: Array<(event?:any)=>void>} = {};
    on(eventName:string, callback:(event?:any)=>void) {
        if (!this._eventsCallbacks.hasOwnProperty(eventName)) {
            this._eventsCallbacks[eventName] = [];
        }
        const listeners = this._eventsCallbacks[eventName];
        if (listeners.indexOf(callback) === -1) {
            listeners.push(callback);
        }
    }

    off(eventName?:string, callback?:(event?:any)=>void):void {
        if (typeof eventName === 'string') {
            if (this._eventsCallbacks.hasOwnProperty(eventName)) {
                if (typeof callback === 'function') {
                    this._removeCallback(eventName, callback)
                }
                else {
                    this._eventsCallbacks[eventName] = [];
                }
            }
        }
        else {
            this._removeAllCallbacks();
        }

    }

    emit(eventName:string, eventData?:any, _this?:object) {
        if (!this._eventsCallbacks.hasOwnProperty(eventName)) return;
        const stack = this._eventsCallbacks[eventName];
        const stackLength = stack.length;
        for(let i = 0; i < stackLength; i++) {
            stack[i].call(_this || this, eventData);
        }
    }

    private _removeCallback(eventName:string, callback:(event?:any)=>void) {
        const stack = this._eventsCallbacks[eventName];
        const callbackInd = stack.indexOf(callback);
        if (callbackInd > -1) {
            stack.splice(callbackInd, 1);
        }
    }

    private _removeAllCallbacks() {
        for (const key in this._eventsCallbacks) {
            if (this._eventsCallbacks.hasOwnProperty(key)) {
                delete this._eventsCallbacks[key];
            }
        }
    }
}
