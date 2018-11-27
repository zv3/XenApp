import { Fetcher } from '../utils/Fetcher';

export default class ThreadApi {
    static get(): Promise {}

    static create(
        forumId: Number,
        title: String,
        body: String,
        otherFields: Object = {}
    ): Promise {
        const payload = Object.assign(
            {
                forum_id: forumId,
                thread_title: title,
                post_body: body
            },
            otherFields
        );

        return Fetcher.post('threads', payload);
    }
}
