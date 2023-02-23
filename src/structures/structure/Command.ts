import * as Oceanic from "oceanic.js";

export type TypeCommand = {
    name: string;
    aliases?: Array<string>;
    description: string;
    options?: Array<Oceanic.ApplicationCommandOptions>;
    type: Oceanic.ApplicationCommandTypes;
    run<T>(ctx: T): Promise<any> 
}

export class Command {
    public name: string;
    public aliases?: Array<string>;
    public description: string;
    public options?: Array<Oceanic.ApplicationCommandOptionBase>;
    public type: Oceanic.ApplicationCommandTypes;

    constructor({name, aliases, description, options, type}: Omit<TypeCommand, "run">) {
        this.name = name;
        this.aliases = aliases;
        this.description = description;
        this.options = options;
        this.type = type;
    }

    async run(): Promise<any>{}
}