import CryptoJs from 'crypto-js';
import { randomString } from './Random';
import { CLIENT_ID, CLIENT_SECRET } from '../Config';
import { AsyncStorage } from 'react-native';

let oAuthData_ = null;

const oneTimeToken = () => {
    const ts = Math.floor(Date.now() / 1000) + 30 * 60;

    const once = CryptoJs.MD5(
        `0${ts}${randomString(16)}${CLIENT_SECRET}`
    ).toString();
    return `0,${ts},${once},${CLIENT_ID}`;
};

const accessToken = () => {
    if (oAuthData_ !== null) {
        return oAuthData_.accessToken;
    }

    return oneTimeToken();
};

const saveToken = (oAuthData) => {
    const oauthData = {
        accessToken: oAuthData.access_token,
        expiresAt: Date.now() + oAuthData.expires_in * 1000,
        refreshToken: oAuthData.refresh_token,
        userId: oAuthData.user_id
    };

    AsyncStorage.setItem('oAuthData', JSON.stringify(oauthData));

    return oauthData;
};

const getOAuthData = () => {
    return new Promise((resolve, reject) => {
        if (oAuthData_ !== null) {
            resolve(oAuthData_);

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
            .catch((error) => reject(error));
    });
};

const setOAuthData = (oAuthData) => {
    oAuthData_ = oAuthData;
};

const get = () => {
    return new Promise((resolve) => {
        getOAuthData()
            .then((data) => resolve(data.accessToken))
            .catch(() => resolve(oneTimeToken()));
    });
};

const removeOAuth = () => AsyncStorage.removeItem('oAuthData');

export const Token = {
    oneTimeToken,
    accessToken,
    saveToken,
    getOAuthData,
    get,
    removeOAuth
};
