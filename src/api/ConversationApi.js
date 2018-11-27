import {Fetcher} from "../utils/Fetcher";

export default class ConversationApi {
    static getList(params: Object = {}, options: Object = {}): Promise {
        return Fetcher.get('conversations', params, options);
    }
}
