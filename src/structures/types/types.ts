import * as Oceanic from "oceanic.js";

export type TypeClient = Oceanic.Client & {
    _events: {
        [key in keyof Oceanic.ClientEvents]?: {
            listener: Function;
        }
    },
    _eventsCount: Number;
}

export type TypeComponentsReply = {
    embeds?: Array<Oceanic.Embed>;
    components?: Array<Oceanic.ButtonComponent>;
    files?: Array<{
        name: string;
        buffer: Buffer;
    }>;
    flags?: number;
    ends?: boolean;
};

export type TypeCommand = {
    name: string;
    aliases?: Array<string>;
    description: string;
    options?: Array<Oceanic.ApplicationCommandOptions>;
    type: Oceanic.ApplicationCommandTypes;
    run<T>(ctx: T): Promise<any> 
}

export type TypeCommandContext = {
    guild: string;
    args: Array<string>;
    response: Oceanic.CommandInteraction | Oceanic.Message;
    send(content: string | TypeComponentsReply, components?: TypeComponentsReply): Oceanic.CommandInteraction | Oceanic.Message;
}

export type TypeEvent = {
    name: keyof Oceanic.ClientEvents;
    once?: boolean;
    run<T>(event: T): Promise<any>;
}