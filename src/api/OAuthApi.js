import { passwordEncrypter } from '../utils/Encrypter';
import { CLIENT_ID, CLIENT_SECRET } from '../Config';
import { Fetcher } from '../utils/Fetcher';

export default class OAuthApi {
    static login(
        username: String,
        password: String,
        tfa: Object = {},
        options: Object = {}
    ): Promise {
        const payload = Object.assign(
            {
                username: username,
                password: passwordEncrypter(password),
                grant_type: 'password',
                client_id: CLIENT_ID,
                password_algo: 'aes128'
            },
            tfa
        );

        return Fetcher.post('oauth/token', payload, options);
    }

    static refresh(oAuthData, options: Object = {}): Promise {
        const payload = {
            grant_type: 'refresh_token',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            refresh_token: oAuthData.refreshToken
        };

        return Fetcher.post('oauth/token', payload, options);
    }
}
