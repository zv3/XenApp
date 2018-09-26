const axios = require("axios");
const {Config} = require("../Config");
const querystring = require("querystring");

const get = (url, params, options = {}) => {
    return request('get', url, params, options)
};

const post = (url, params, options = {}) => {
    return request('post', url, params, options)
};

const put = (url, params, options = {}) => {
    return request('put', url, params, options)
};

const del = (url, params, options = {}) => {
    return request('delete', url, params, options)
};

const request = (method, url, params, options) => {
    const client = axios.create({
        baseURL: Config.baseUrl,
        timeout: 30000,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },

        transformRequest: [function(data, headers) {
            return querystring.stringify(data);
        }],

        paramsSerializer: function(params) {
            return querystring.stringify(params);
        },

        validateStatus: function(status) {
            if (status >= 400 && status <= 404) {
                return true;
            }

            return status >= 200 && status < 300;
        }
    });

    let onSuccess, onError, onComplete;
    if (options.hasOwnProperty('onSuccess')) {
        onSuccess = options.onSuccess;
        delete options.onSuccess;
    }

    if (options.hasOwnProperty('onError')) {
        onError = options.onError;
        delete options.onError;
    }

    if (options.hasOwnProperty('onComplete')) {
        onComplete = options.onComplete;
        delete options.onComplete;
    }

    const isFunction = (obj) => {
        return typeof obj === 'function';
    };

    // full options: https://github.com/axios/axios#request-config
    let requestOptions = Object.assign({
        method: method,
        url: url,
        data: params,
        timeout: 30000
    }, options);

    client.request(requestOptions)
        .then((response) => {
            const data = response.data;

            if (data.hasOwnProperty('errors') || response.status !== 200) {
                if (isFunction(onError)) {
                    onError(data.errors);
                }
            } else {
                // guess that it's ok
                if (isFunction(onSuccess)) {
                    onSuccess(data);
                }
            }
        })
        .catch((error) => {
            if (isFunction(onError)) {
                onError();
            }
        })
        .then(() => {
            if (isFunction(onComplete)) {
                onComplete();
            }
        });
};

export const apiFetcher = {
    get, post, put, del, request
};
