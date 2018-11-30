import CryptoJs from 'crypto-js';
import { randomString } from './Random';
import { CLIENT_ID, CLIENT_SECRET } from '../Config';
import { AsyncStorage } from 'react-native';

let _oAuthData = null;

const oneTimeToken = () => {
    const ts = Math.floor(Date.now() / 1000) + 30 * 60;

    const once = CryptoJs.MD5(
        `0${ts}${randomString(16)}${CLIENT_SECRET}`
    ).toString();
    return `0,${ts},${once},${CLIENT_ID}`;
};

const saveToken = (oAuthData) => {
    const oauthData = {
        accessToken: oAuthData.access_token,
        expiresAt: Date.now() + oAuthData.expires_in * 1000,
        refreshToken: oAuthData.refresh_token,
        userId: oAuthData.user_id
    };

    AsyncStorage.setItem('oAuthData', JSON.stringify(oauthData));

    setOAuthData(oauthData);

    return oauthData;
};

const getOAuthData = () => {
    return new Promise((resolve, reject) => {
        if (_oAuthData !== null) {
            resolve(_oAuthData);

            return;
        }

        AsyncStorage.getItem('oAuthData')
            .then((data) => {
                let oAuthDataJson = JSON.parse(data);
                if (!oAuthDataJson) {
                    reject(new Error('Invalid oauth data'));
                    return;
                }

                setOAuthData(oAuthDataJson);
                resolve(oAuthDataJson);
            })
            .catch(reject);
    });
};

const setOAuthData = (oAuthData) => _oAuthData = oAuthData;

const get = () => {
    if (_oAuthData !== null) {
        return _oAuthData.accessToken;
    }

    return oneTimeToken();
};

const removeOAuth = () => AsyncStorage.removeItem('oAuthData');

export const Token = {
    saveToken,
    getOAuthData,
    get,
    removeOAuth
};
