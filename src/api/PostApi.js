import { Fetcher } from '../utils/Fetcher';

export default class PostApi {
    static create(
        threadId: Number,
        body: String,
        otherFields: Object = {}
    ): Promise {
        const payload = Object.assign(
            {
                thread_id: threadId,
                post_body: body
            },
            otherFields
        );

        return Fetcher.post('posts', payload);
    }

    static like(postId: Number): Promise {
        return Fetcher.post(`posts/${postId}/likes`);
    }

    static unlike(postId: Number): Promise {
        return Fetcher.del(`posts/${postId}/likes`);
    }
}
