interface IEvent {
    (...args: Array<any>): any
}

export default class EventEmitter {

    private events: Map<string, Array<IEvent>> = new Map();

    constructor() {
        this.on = this.on.bind(this);
    }

    public on(name: string, handler: IEvent): EventEmitter {
        if (!this.events.has(name)) {
            this.events.set(name, []);
        }
        this.events.get(name).push(handler);
        return this;
    }

    public off(name: string, handler?: IEvent): EventEmitter {
        if (!this.events.has(name)) return this;
        if (!handler) {
            this.events.delete(name);
        } else {
            const eventList: Array<IEvent> = this.events.get(name);
            let index = eventList.indexOf(handler);
            while (index !== -1) {
                eventList.splice(index, 1);
                index = eventList.indexOf(handler);
            }
        }
        return this;
    }

    public trigger(name: string, ...arg: Array<any>): EventEmitter {
        if (!this.events.has(name)) return this;

        this.events.get(name).forEach((handler: IEvent) => {
            handler.apply(this, arg);
        });
        return this;
    }

    public dispose() {
        this.events.clear();
    }
}