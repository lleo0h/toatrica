import * as Oceanic from "oceanic.js";

export class Event {
    public name: keyof Oceanic.ClientEvents;
    public once?: boolean;

    constructor({name, once}: Omit<Event, "run">) {
        this.name = name;
        this.once = once || false;
    }

    async run<T>(...events: any | T): Promise<any>{}
}