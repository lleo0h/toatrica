import * as Oceanic from "oceanic.js";
import fs from "fs";
import {settings} from "../../settings";
import {Command, Context} from "../structure/Command";

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

            if (command) {
                await ctx.channel?.sendTyping();
                command.run(new Context(ctx));
            }
        }
        else {
            const command = this.commands.get(ctx.data.name);
            if (command) command.run(new Context(ctx));
        }
    }
}

export const CommandManager = new _CommandManager();