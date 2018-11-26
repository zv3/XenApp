import { Fetcher } from '../utils/Fetcher';

export default class UserApi {
    static get(userId: any, params: any): Promise {
        return new Promise((resolve, reject) => {
            Fetcher.get(`users/${userId}`, params)
                .then((response) => resolve(response.user))
                .catch(reject);
        });
    }
}
