import * as Oceanic from "oceanic.js";
import {TypeEvent} from "../types/types";

export class Event {
    public name: keyof Oceanic.ClientEvents;
    public once?: boolean;

    constructor({name, once}: Omit<TypeEvent, "run">) {
        this.name = name;
        this.once = once || false;
    }

    async run(...events: any): Promise<any>{}
}