const _events = {};

export default class BaseEvent {
    static addListener(name: String, callback: Function): void {
        if (!_events.hasOwnProperty([[name]])) {
            _events[[name]] = [];
        }

        _events[[name]].push(callback);
    }

    static removeListener(name: String, callback: Function): void {
        if (_events.hasOwnProperty([[name]])) {
            _events[[name]].filter((c) => c !== callback);
        }
    }

    static dispatch(name: String, ...data: any): void {
        if (_events.hasOwnProperty([[name]])) {
            for (let i = 0; i < _events[[name]].length; i++) {
                const observer = _events[[name]][i];
                observer(...data);
            }
        }
    }

    static removeAllListeners(name: ?String): void {
        if (name) {
            if (_events.hasOwnProperty([name])) {
                delete _events[[name]];
            }
        } else {
            for (const name in _events) {
                if (_events.hasOwnProperty(name)) {
                    delete _events[name];
                }
            }
        }
    }
}
