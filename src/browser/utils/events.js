const eventPrefix = 'EVENT_';

export default class Events {

    constructor() {
        this._events = {};
    }

    on(name, handler) {
        if (!this._events[eventPrefix + name]) {
            this._events[eventPrefix + name] = [];
        }
        this._events[eventPrefix + name].push(handler);
    }

    off(name, handler) {
        if (!this._events[eventPrefix + name]) return;
        if (!handler) {
            delete this._events[eventPrefix + name];
        } else {
            const pool = this._events[eventPrefix + name];

            let index = pool.indexOf(handler);

            while (index != -1) {
                pool.spliec(index, 1);
                index = pool.indexOf(handler);
            }
        }
    }

    trigger() {
        const args = Array.prototype.slice.call(arguments);
        if (!args.length) return;

        const name = args.shift();

        if (!this._events[eventPrefix + name]) return;
        this._events[eventPrefix + name].forEach((handler) => {
            handler.apply(this, args);
        });
    }

    dispose() {
        this._events = {};
    }
}