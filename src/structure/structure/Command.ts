import * as Oceanic from "oceanic.js";
import {Context} from "./Context.js";

export class Command {
    public name: string;
    public description?: string;   
    public aliases?: string[];
    public options?: Oceanic.ApplicationCommandOptions[];
    public type?: Oceanic.ApplicationCommandTypes;
    public disableSlash?: boolean;

    constructor({name, aliases, description, options, type, disableSlash}: Omit<Command, "run">) {
        this.name = name;
        this.aliases = aliases;
        this.description = description;
        this.options = options;
        this.type = type;
        this.disableSlash = disableSlash;
    }

    async run(ctx: Context<any>): Promise<any>{};
}