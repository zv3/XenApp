import { Token } from './Token';
import { Fetcher } from './Fetcher';

let visitorObject = null;

const getVisitor = () => {
    return new Promise((resolve, reject) => {
        const onFailed = () => reject(new Error('Invalid oauth data'));

        if (visitorObject === null) {
            Token.getOAuthData()
                .then((data) => {
                    Fetcher.get('users/me', {
                        oauth_token: data.accessToken
                    })
                        .then((data) => {
                            visitorObject = Object.freeze(data.user);
                            resolve(visitorObject);
                        })
                        .catch(onFailed);
                })
                .catch(onFailed);
        } else {
            resolve(visitorObject);
        }
    });
};

export const Visitor = {
    getVisitor
};
