import {Config} from '../Config'
import CryptoJS from "crypto-js"

const passwordEncrypter = (password) => {
    const key = CryptoJS.MD5(Config.clientSecret);
    const encrypted = CryptoJS.AES.encrypt(password, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
};

export {
    passwordEncrypter
}