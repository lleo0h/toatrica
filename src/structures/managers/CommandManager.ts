import * as Oceanic from "oceanic.js";
import fs from "fs";
import {settings} from "../../settings";
import {TypeCommand} from "../structure/Command";

class Context {
    public guild: Oceanic.Guild;
    public args: Array<string | boolean | number>
    public ctx: Oceanic.CommandInteraction | Oceanic.Message

    constructor(ctx: Oceanic.CommandInteraction | Oceanic.Message) {
        this.guild = ctx.guild!;
        this.args = [];
        this.ctx = ctx;

        if (ctx instanceof Oceanic.Message) this.args = ctx.content.split(" ");
        else {
            if (ctx.data?.options == undefined) return;
            for (const arg of ctx.data.options.raw as Oceanic.InteractionOptionsWithValue[]) this.args.push(arg.value);
        }
    }

    public async reply(content: string) {
        return this.ctx.channel!.createMessage({
            content
        })
    }
}

class _CommandManager {
    public commands: Map<string, Omit<TypeCommand, "name">>
    public aliases: Map<string, Omit<TypeCommand, "name" | "type">>

    constructor() {
        this.commands = new Map();
        this.aliases = new Map();
        this.loader();
    }

    private async loader() {
        for (const file of fs.readdirSync(`${__dirname}/../../commands`)) {
            const command = await import(`../../commands/${file}`);
            const {name, aliases, description, type, options, run} = new command.default as TypeCommand;

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

            if (command) command.run(new Context(ctx));
        }
        else {
            const command = this.commands.get(ctx.data.name);
            if (command) command.run(new Context(ctx));
        }
    }
}

export const CommandManager = new _CommandManager();