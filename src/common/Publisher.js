export default class Publisher {
    constructor(map){
        this.subscriptionMap = map || {
            // event: [subscribers]
        };
    }

    on(event, listener){
        this._addEventListener(event, listener);
    }

    dispatch(event, args){
        this._dispatchEvent(event, args);
    }

    _addEventListener(event, listener){
            let eventListeners = this.subscriptionMap[event];

            if(!eventListeners || !eventListeners.length){
                eventListeners = [];
                this.subscriptionMap[event] = eventListeners;
            }

            eventListeners.push(listener);
    }

    _dispatchEvent(event, args){
        let eventListeners = this.subscriptionMap[event];

        if(typeof eventListeners === 'object' && eventListeners.length){
            eventListeners.forEach(listener => listener(args));
        }
    }
}