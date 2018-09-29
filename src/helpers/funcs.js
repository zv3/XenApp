import {Alert} from "react-native"

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

const handleDefaultErrors = (errors, alertTitle = null) => {
    let errorShown;
    if (isPlainObject(errors)) {
        errorShown = errors[0];
    }

    Alert.alert(
        alertTitle ? alertTitle : 'Error',
        errorShown ? errorShown : 'Whoops! Something went wrong.'
    );
};

export {
    isPlainObject,
    isFunction,
    handleDefaultErrors
};