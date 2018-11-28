import { Fetcher } from '../utils/Fetcher';

const _batchParams = [];

export default class BatchApi {
    static addRequest(method: String, uri: String, params: Object = {}): void {
        _batchParams.push({
            method: method,
            uri: uri,
            params: params
        });
    }

    static addRequests(requests: Array): void {
        requests.every((request) => this.addRequest(request));
    }

    static dispatch(options: Object = {}): Promise {
        if (_batchParams.length === 0) {
            throw new Error('There are no batch requests');
        }

        const removeAllBatchParams = () => {
            while (_batchParams.length > 0) {
                _batchParams.pop();
            }
        };

        return new Promise((resolve, reject) => {
            Fetcher.post('batch', JSON.stringify(_batchParams), options)
                .then((response) => {
                    removeAllBatchParams();
                    resolve(response.jobs);
                })
                .catch((error) => {
                    removeAllBatchParams();
                    reject(error);
                });
        });
    }
}
