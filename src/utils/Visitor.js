import { Token } from './Token';
import UserApi from '../api/UserApi';

let visitorObject_ = null;

const getVisitor = () => {
    return new Promise((resolve, reject) => {
        const onFailed = () => reject(new Error('Invalid oauth data'));

        if (visitorObject_ === null) {
            Token.getOAuthData()
                .then((data) => {
                    UserApi.get('me', { oauth_token: data.accessToken })
                        .then((data) => {
                            setVisitor(data.user);
                            resolve(visitorObject_);
                        })
                        .catch(onFailed);
                })
                .catch(onFailed);
        } else {
            resolve(visitorObject_);
        }
    });
};

const setVisitor = (user: Object) => {
    visitorObject_ = Object.freeze(user);
};

export const Visitor = {
    getVisitor,
    setVisitor
};
