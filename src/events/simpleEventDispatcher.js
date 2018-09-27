import {isFunction} from "../helpers/funcs";

let observers = {};
let registeredId = 0;

const subscribe = (event, callback) => {
    if (!isFunction(callback)) {
        throw new Error('Callback must be a function.');
    }

    if (!observers.hasOwnProperty(event)) {
        observers[event] = {};
    }

    registeredId++;
    observers[event][registeredId] = callback;

    return registeredId;
};

const unsubscribe = (event, id) => {
    if (observers.hasOwnProperty(event)
        && observers[event].hasOwnProperty(id)
    ) {
        delete observers[event][id];
    }
};

const fire = (event) => {
    if (!observers.hasOwnProperty(event)) {
        return;
    }

    const observers_ = observers[event];

    for (let key in observers_) {
        if (observers_.hasOwnProperty(key)) {
            observers_[key]();
        }
    }

    delete observers[event];
};

export const simpleEventDispatcher = {
    subscribe, fire, unsubscribe
};