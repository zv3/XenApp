import BaseEvent from './BaseEvent';

export default class AuthEvent extends BaseEvent {
    static addListener(callback: Function): void {
        BaseEvent.addListener('AuthEvent', callback);
    }

    static removeListener(callback: Function): void {
        BaseEvent.removeListener('AuthEvent', callback);
    }

    static dispatch(...data): void {
        BaseEvent.dispatch('AuthEvent', ...data);
    }
}
