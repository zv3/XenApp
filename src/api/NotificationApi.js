import { Fetcher } from '../utils/Fetcher';

export default class NotificationApi {
    static getList(params: Object = {}, options: Object = {}): Promise {
        return Fetcher.get('notifications', params, options);
    }

    static getContent(id: Number, options: Object = {}): Promise {
        return Fetcher.get(`notifications/${id}/content`, {}, options);
    }

    static markAllRead(): Promise {
        return Fetcher.post('notifications/read');
    }
}
