let _visitor = null;
export default class Visitor {
    static getVisitor() {
        return _visitor;
    }

    static setVisitor(user: Object) {
        _visitor = user;
    }

    static isGuest() {
        return _visitor === null;
    }
}
