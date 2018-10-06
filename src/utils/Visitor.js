import {Token} from "./Token";
import {fetcher} from "./Fetcher";

let visitorObject = null;

const getVisitor = () => {
    return new Promise((resolve, reject) => {
        if (visitorObject === null) {
            Token.getOAuthData()
                .then((data) => {
                    fetcher.get('users/me', {
                        query: {
                            oauth_token: data.accessToken
                        }
                    }).then((data) => {
                        visitorObject = Object.freeze(data.user);
                        resolve(visitorObject);
                    }).catch((error) => {
                        reject(error);
                    });
                })
                .catch((error) => {
                    reject('Invalid oauth data');
                })
        } else {
            resolve(visitorObject);
        }
    });
};

export const Visitor = {
    getVisitor
};