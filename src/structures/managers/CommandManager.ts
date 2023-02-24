import * as Oceanic from "oceanic.js";
import fs from "fs";
import {Buffer} from 'node:buffer';
import {settings} from "../../settings";
import {Command, TypeComponentsSend} from "../structure/Command";

class Context {
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

    public send(content: string | TypeComponentsSend, components?: TypeComponentsSend) {
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
            if (components?.flags) return; 
            if (this.response instanceof Oceanic.Message) result.messageReference = {messageID: this.response.id}
            this.response.channel!.createMessage(result);
        }
    } 
}

class _CommandManager {
    public commands: Map<string, Omit<Command, "name">>
    public aliases: Map<string, Omit<Command, "name" | "type">>

    constructor() {
        this.commands = new Map();
        this.aliases = new Map();
        this.loader();
    }

    private async loader() {
        for (const file of fs.readdirSync(`${__dirname}/../../commands`)) {
            const command = await import(`../../commands/${file}`);
            const {name, aliases, description, type, options, run} = new command.default as Command;

            this.commands.set(name, {aliases, description, type, options, run});

            if (aliases) {
                for (const alias of aliases) {
                    this.aliases.set(alias, {description, run});
                }
            }
        }

        console.log("Loadded commands");
    }

    public async run(ctx: Oceanic.CommandInteraction | Oceanic.Message) {
        if (ctx instanceof Oceanic.Message) {
            if (ctx.channel?.type == undefined) return;
            if (ctx.channel!.type == 1) return;
            if (!ctx.content.startsWith(settings.client.prefix)) return;

            const name = ctx.content.slice(settings.client.prefix.length).split(" ")[0]
            const command = this.commands.get(name) || this.aliases.get(name);

            await ctx.channel?.sendTyping();

            if (command) command.run(new Context(ctx));
        }
        else {
            const command = this.commands.get(ctx.data.name);
            if (command) command.run(new Context(ctx));
        }
    }
}

export const CommandManager = new _CommandManager();