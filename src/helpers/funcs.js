const isPlainObject = (obj) => {
    if (obj === undefined || obj === null) {
        return false;
    }

    return typeof obj === 'object';
};

const isFunction = (fn) => {
    if (fn === undefined || fn === null) {
        return false;
    }

    return typeof fn === 'function';
};

export {
    isPlainObject,
    isFunction
};