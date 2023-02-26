import * as Oceanic from "oceanic.js";

export type TypeContextSend = {
    ends?: boolean;
    flags?: number;
    embeds?: Array<Oceanic.Embed>;
    components?: Array<Oceanic.ButtonComponent>;
    files?: Array<{
        name: string;
        buffer: Buffer;
    }>;  
};

export class Command {
    public name: string;
    public aliases?: Array<string>;
    public description: string;
    public options?: Array<Oceanic.ApplicationCommandOptions>;
    public type: Oceanic.ApplicationCommandTypes;
    public disableSlash?: boolean

    constructor({name, aliases, description, options, type, disableSlash}: Omit<Command, "run">) {
        this.name = name;
        this.aliases = aliases;
        this.description = description;
        this.options = options;
        this.type = type;
        this.disableSlash = disableSlash;
    }

    async run(ctx: Context): Promise<any>{}
}

export class Context {
    public guild: Oceanic.Guild;
    public args: Array<string | boolean | number>;
    public response: Oceanic.CommandInteraction | Oceanic.Message

    constructor(ctx: Oceanic.CommandInteraction | Oceanic.Message) {
        this.guild = ctx.guild!;
        this.args = [];
        this.response = ctx;

        if (ctx instanceof Oceanic.Message) this.args = ctx.content.split(" ").slice(1);
        else {
            if (ctx.data?.options == undefined) return;
            for (const arg of ctx.data.options.raw as Oceanic.InteractionOptionsWithValue[]) this.args.push(arg.value);
        }
    }

    public async send(content: string | TypeContextSend, components?: TypeContextSend): Promise<Oceanic.CommandInteraction | Oceanic.Message | undefined> {
        const _components_values: {
            files: {name: string; contents: Buffer}[];
            components: Oceanic.MessageActionRow[];
        } = {
            files: [],
            components: [{
                type: 1,
                components: []
            }]
        }

        if (typeof content == "object") components = content;
        if (components?.files) {
            for (const file of components.files) {
                _components_values.files.push({
                    name: file.name,
                    contents: file.buffer
                });
            }
        }
        if (components?.components) {
            let count = 0;
            let index = 0;
            for (const component of components.components) {
                if (count >= 5) {
                    index++;
                    _components_values.components.push({
                        type: 1,
                        components: []  
                    })
                }
                
                _components_values.components[index].components.push(component);
                count++;
            }
        }

        const result: Oceanic.CreateMessageOptions = {
            content: typeof content == "string" ? content : undefined,
            embeds: components?.embeds ? components?.embeds : undefined,
            files: _components_values.files ? _components_values.files : undefined,
            components: _components_values.components[0].components[0] != undefined ? _components_values.components : undefined
        }

        if (components?.ends && this.response instanceof Oceanic.CommandInteraction) {
            result.flags = components?.flags;
            this.response.createMessage(result);
        } else {
            if (this.response instanceof Oceanic.Message) result.messageReference = {messageID: this.response.id}
            return this.response.channel!.createMessage(result);
        }
    }
}