import CryptoJS from "crypto-js"
import {CLIENT_SECRET} from "../Config";

const passwordEncrypter = (password) => {
    const key = CryptoJS.MD5(CLIENT_SECRET);
    const encrypted = CryptoJS.AES.encrypt(password, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
};

export {
    passwordEncrypter
}