import { Fetcher } from '../utils/Fetcher';

export default class ConversationApi {
    static getList(params: Object = {}, options: Object = {}): Promise {
        return Fetcher.get('conversations', params, options);
    }

    static reply(
        convoId: Number,
        message: String,
        options: Object = {}
    ): Promise {
        return Fetcher.post(
            'conversation-messages',
            {
                conversation_id: convoId,
                message_body: message
            },
            options
        );
    }

    static likeMessage(messageId: Number, options: Object = {}): Promise {
        return Fetcher.post(`conversation-messages/${messageId}/likes`, {}, options);
    }

    static unlikeMessage(messageId: Number, options: Object = {}): Promise {
        return Fetcher.del(`conversation-messages/${messageId}/likes`, {}, options);
    }
}
