import {AsyncStorage} from "react-native"
import {dataDecrypter} from "./encrypter";
import {Config} from "../Config";

const put = (name, value) => {
    try {
        AsyncStorage.setItem(name, JSON.stringify(value));
    } catch (e) {
    }
};

const get = (name) => {
    return AsyncStorage.getItem(name);
};

const remove = (name) => {
    try {
        AsyncStorage.removeItem(name);
    } catch (e) {
    }
};

const clear = () => {
    try {
        AsyncStorage.clear();
    } catch (e) {
    }
};

const setOAuthData = (data) => {
    put(Config.Constants.OAUTH_DATA, data);
};

const getOAuthData = (callback) => {
    return get(Config.Constants.OAUTH_DATA);
};

export const dataStore = {
    put, get, remove, setOAuthData, getOAuthData
};