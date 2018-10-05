import CryptoJs from "crypto-js";
import {randomString} from "./Random"
import {CLIENT_ID, CLIENT_SECRET} from "../Config";

const oneTimeToken = () => {
    const ts = Date.now() + 30 * 60;

    const once = CryptoJs.MD5(`0${ts}${randomString(16)}${CLIENT_SECRET}`).toString();
    return `0,${ts},${once},${CLIENT_ID}`;
};

const accessToken = () => {
    return oneTimeToken();
};

export {
    oneTimeToken, accessToken
};