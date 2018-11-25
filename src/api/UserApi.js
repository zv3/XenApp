import { Fetcher } from '../utils/Fetcher';

export default class UserApi {
    static get(userId: any, params: any): Promise {
        return Fetcher.get(`/users/${userId}`, params);
    }
}
