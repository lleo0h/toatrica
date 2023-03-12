import * as Oceanic from "oceanic.js";

export class Event {
    public name: keyof Oceanic.ClientEvents;
    public once?: boolean = false;

    constructor({name, once}: Omit<Event, "run">) {
        this.name = name;
        this.once = once;
    }

    async run(...events: any): Promise<any>{}
}