import querystring from 'querystring';
import { BASE_URL } from '../Config';
import { Token } from './Token';
import axios from 'axios';

const get = (uri, params: Object = {}, options: Object = {}) => {
    const opts = Object.assign({}, { params: params }, options);

    return request('GET', uri, opts);
};
const post = (uri, data: Object = {}, options: Object = {}) => {
    const opts = Object.assign({}, { data: data }, options);

    return request('POST', uri, opts);
};
const put = (uri, data: Object = {}, options: Object = {}) => {
    const opts = Object.assign({}, { data: data }, options);

    return request('PUT', uri, opts);
};
const del = (uri, data: Object = {}, options: Object = {}) => {
    const opts = Object.assign({}, { data: data }, options);

    return request('DELETE', uri, opts);
};

const request = (method: String, uri: String, options: Object) => {
    const opts = Object.assign(
        {
            baseURL: BASE_URL,
            method: method,
            timeout: 5000,
            params: {},
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data;charset=UTF-8'
            },
            paramsSerializer: function(params) {
                return querystring.stringify(params);
            },
            validateStatus: function(status) {
                return status >= 200 && status < 403;
            },
            onCancelSetup: null
        },
        options
    );

    const methodUpper = method.toUpperCase();
    if (
        typeof opts.data === 'object' &&
        (methodUpper === 'POST' ||
            methodUpper === 'PUT' ||
            methodUpper === 'DELETE')
    ) {
        const formData = new FormData();
        for (const key in opts.data) {
            if (opts.data.hasOwnProperty(key)) {
                formData.append(key, opts.data[key]);
            }
        }

        opts.data = formData;
    }

    let onCancelSetup = null;
    if (opts.onCancelSetup) {
        onCancelSetup = opts.onCancelSetup;
        delete opts.onCancelSetup;
    }

    const normalizeUri = (uri) => {
        if (uri.substr(0, 1) === '/') {
            uri = uri.substr(1);
        }

        return uri;
    };

    let skipDefaultHandler = false;
    if (opts.hasOwnProperty('skipDefaultHandler')) {
        skipDefaultHandler = opts.skipDefaultHandler;
        delete opts.skipDefaultHandler;
    }

    return new Promise((resolve, reject) => {
        const token = Token.get();
        if (!opts.params || !opts.params.oauth_token) {
            opts.params.oauth_token = token;
        }

        const isFullUri =
            uri.indexOf('http://') === 0 || uri.indexOf('https://') === 0;
        opts.url = isFullUri ? uri : `api/index.php?${normalizeUri(uri)}`;

        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        if (typeof onCancelSetup === 'function') {
            onCancelSetup(source);
        }

        const instance = axios.create({
            cancelToken: source.token
        });

        instance
            .request(opts)
            .then((response) => {
                const data = response.data;

                if (skipDefaultHandler) {
                    resolve(response);
                } else {
                    if (
                        data.hasOwnProperty('status') &&
                        data.status === 'error'
                    ) {
                        if (Array.isArray(data.errors)) {
                            reject([new Error(data.errors[0]), response]);
                        } else {
                            const errorKeys = Object.keys(data.errors);
                            reject([
                                new Error(data.errors[errorKeys[0]]),
                                response
                            ]);
                        }
                    } else {
                        resolve(data);
                    }
                }
            })
            .catch((error) => {
                axios.isCancel(error)
                    ? reject([new Error('Request cancelled'), null])
                    : reject([error, null]);
            });
    });
};

export const Fetcher = {
    get,
    post,
    put,
    del
};
