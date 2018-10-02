import {Alert} from "react-native"
import CryptoJs from "crypto-js";
import {Config} from "../Config";

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
    if (Array.isArray(errors)) {
        errorShown = errors[0];
    }

    Alert.alert(
        alertTitle ? alertTitle : 'Error',
        errorShown ? errorShown : 'Whoops! Something went wrong.'
    );
};

const randomString = (length) => {
    return Math.random().toString(36).substring(2, length + 2)
        + Math.random().toString(36).substring(2, length + 2);
};

const getOneTimeToken = () => {
    const ts = Date.now() + 30 * 60;
    const once = CryptoJs.MD5(`0${ts}${randomString(16)}${Config.clientSecret}`).toString();
    return `0,${ts},${once},${Config.clientId}`;
};

export {
    isPlainObject,
    isFunction,
    handleDefaultErrors,
    randomString,
    getOneTimeToken
};