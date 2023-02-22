import * as Oceanic from "oceanic.js";

export type TypeEvent = {
    name: keyof Oceanic.ClientEvents;
    once?: boolean;
    run<T>(event: T): Promise<any>;
}

export class Event {
    public name: keyof Oceanic.ClientEvents;
    public once?: boolean;

    constructor({name, once}: Omit<TypeEvent, "run">) {
        this.name = name;
        this.once = once || false;
    }

    async run(...events: any): Promise<any>{}
}