import CryptoJs from 'crypto-js';
import { randomString } from './Random';
import { CLIENT_ID, CLIENT_SECRET } from '../Config';
import { AsyncStorage } from 'react-native';

let oAuthData_ = null;

const oneTimeToken = () => {
    const ts = Date.now() + 30 * 60;

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
    let oauthData = {
        accessToken: oAuthData.access_token,
        expiresAt: Date.now() + oAuthData.expires_in * 1000,
        refreshToken: oAuthData.refresh_token,
        userId: oAuthData.user_id
    };

    AsyncStorage.setItem('oAuthData', JSON.stringify(oauthData));
};

const getOAuthData = () => {
    return new Promise((resolve, reject) => {
        if (oAuthData_ !== null) {
            resolve(oAuthData_);

            return;
        }

        AsyncStorage.getItem('oAuthData')
            .then((data) => {
                let oAuthDataJson;
                try {
                    oAuthDataJson = JSON.parse(data);
                } catch (e) {}

                if (!oAuthDataJson) {
                    reject('Invalid oauth data');
                    return;
                }

                setOAuthData(oAuthDataJson);
                resolve(oAuthDataJson);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const setOAuthData = (oAuthData) => {
    oAuthData_ = oAuthData;
};

export const Token = {
    oneTimeToken,
    accessToken,
    saveToken,
    getOAuthData
};
