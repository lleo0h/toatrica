import * as Oceanic from "oceanic.js";

export type TypeComponentsSend = {
    ends?: boolean;
    flags?: number;
    embeds?: Array<Oceanic.Embed>;
    components?: Array<Oceanic.ButtonComponent>;
    files?: Array<{
        name: string;
        buffer: Buffer;
    }>;  
};

export type TypeCommandContext = {
    guild: Oceanic.Guild;
    args: Array<string | boolean | number>;
    response: Oceanic.CommandInteraction | Oceanic.Message;
    send(content: string | TypeComponentsSend, components?: TypeComponentsSend): void
}

export class Command {
    public name: string;
    public aliases?: Array<string>;
    public description: string;
    public options?: Array<Oceanic.ApplicationCommandOptions>;
    public type: Oceanic.ApplicationCommandTypes;

    constructor({name, aliases, description, options, type}: Omit<Command, "run">) {
        this.name = name;
        this.aliases = aliases;
        this.description = description;
        this.options = options;
        this.type = type;
    }

    async run<T>(ctx: TypeCommandContext): Promise<any>{}
}