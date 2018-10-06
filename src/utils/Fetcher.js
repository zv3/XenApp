import querystring from 'querystring';
import { BASE_URL } from '../Config';
import { Token } from './Token';

const get = (uri, options = {}) => {
    return request('GET', uri, options);
};
const post = (uri, options) => {
    return request('POST', uri, options);
};
const put = (uri, options) => {
    return request('PUT', uri, options);
};
const del = (uri, options = {}) => {
    return request('DELETE', uri, options);
};

const request = (method, uri, options) => {
    let config = Object.assign(
        {},
        {
            method: method,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        },
        options
    );
    if (!config.hasOwnProperty('cache')) {
        config.cache = 'default';
    }

    const appendAccessToken = (object) => {
        if (!object.hasOwnProperty('oauth_token')) {
            object.oauth_token = Token.accessToken();
        }

        return object;
    };

    if (config.method === 'GET' || config.method === 'HEAD') {
        let query;
        if (config.hasOwnProperty('body')) {
            query = config.body;
            delete config.body;
        } else if (config.hasOwnProperty('query')) {
            query = config.query;
            delete config.query;
        }

        if (query === null || (query && typeof query !== 'object')) {
            throw new Error('Query must be an object.');
        }

        if (query) {
            appendAccessToken(query);

            uri = `${uri}&${querystring.stringify(query)}`;
        }
    } else {
        if (uri.indexOf('batch') === 0) {
            if (uri.indexOf('oauth_token=') === -1) {
                uri = `${uri}&oauth_token=${Token.accessToken()}`;
            }
        }

        if (typeof config.body === 'object') {
            config.body = appendAccessToken(config.body);
            config.body = querystring.stringify(config.body);
        }
    }

    let timeout = 30000; // 30 seconds
    if (config.hasOwnProperty('timeout')) {
        timeout = config.timeout;
        delete config.timeout;
    }

    let exceeded = false;
    if (uri.indexOf('http') !== 0) {
        uri = `${BASE_URL}/api/index.php?${uri}`;
    }

    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            exceeded = true;

            reject(['Request time out']);
        }, timeout);

        fetch(uri, config)
            .then((response) => response.json())
            .then((response) => {
                clearTimeout(timeoutId);

                if (
                    response.hasOwnProperty('errors') &&
                    response.status === 'error'
                ) {
                    reject(response.errors);

                    return;
                }

                if (exceeded) {
                    reject(['Request time out']);
                } else {
                    resolve(response);
                }
            })
            .catch((error) => {
                if (exceeded) {
                    return;
                }

                reject(error);
            });
    });
};

export const fetcher = {
    get,
    post,
    put,
    del
};
