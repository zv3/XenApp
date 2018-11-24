import querystring from 'querystring';
import { BASE_URL } from '../Config';
import { Token } from './Token';
import axios from 'axios';

const get = (uri, params: any, options: ?Object) => {
    const opts = Object.assign(
        {},
        {
            params: params
        },
        options
    );

    return request('GET', uri, opts);
};
const post = (uri, data: any, options: ?Object) => {
    const opts = Object.assign({}, { data: data }, options);

    return request('POST', uri, opts);
};
const put = (uri, data: any, options: ?Object) => {
    const opts = Object.assign({}, { data: data }, options);
    return request('PUT', uri, opts);
};
const del = (uri, data: any, options: ?Object) => {
    const opts = Object.assign({}, { data: data }, options);

    return request('DELETE', uri, opts);
};

const request = (method: String, uri: String, options: Object) => {
    const opts = Object.assign(
        {
            baseURL: BASE_URL,
            method: method,
            timeout: 1000,
            params: {},
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data;charset=UTF-8'
            },
            paramsSerializer: function(params) {
                return querystring.stringify(params);
            },
            validateStatus: function(status) {
                return status >= 200 && status < 404;
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
        opts.data = querystring.stringify(opts.data);
    }

    let onCancelSetup = null;
    if (opts.onCancelSetup) {
        onCancelSetup = opts.onCancelSetup;
        delete opts.onCancelSetup;
    }

    return new Promise((resolve, reject) => {
        Token.get().then((token) => {
            if (!opts.params.oauth_token) {
                opts.params.oauth_token = token;
            }

            opts.url = uri.indexOf('http') === 0 ? uri : `api/index.php?${uri}`;

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
                    if (
                        data.hasOwnProperty('status') &&
                        data.status === 'error'
                    ) {
                        reject(new Error(data.message));
                    } else {
                        resolve(data);
                    }
                })
                .catch((error) => {
                    axios.isCancel(error)
                        ? reject(new Error('Request cancelled'))
                        : reject(error);
                });
        });
    });
};

export const Fetcher = {
    get,
    post,
    put,
    del
};
