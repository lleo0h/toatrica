import * as Oceanic from "oceanic.js";
import fs from "fs";
import {Command} from "../structure/Command.js";
import {Context} from "../structure/Context.js";

const prefix = "t/";

export class CommandManager {
    public commands: Map<string, Omit<Command, "name">>;
    public aliases: Map<string, Omit<Command, "name" | "type">>;

    constructor() {
        this.commands = new Map();
        this.aliases = new Map();
        this.loader();
    }

    public async loader(dir?: string) {
        if (dir == undefined) return;

        for (const file of fs.readdirSync(dir)) {
            const command = await import(`../../commands/${file}`);
            const {name, aliases, description, type, options, disableSlash, run} = new command.default as Command;

            this.commands.set(name, {aliases, description, type, options, disableSlash, run});

            if (aliases) {
                for (const alias of aliases) {
                    this.aliases.set(alias, {description, run});
                }
            }
        }

        console.log("Loadded commands");
        return this;
    }

    public async run(ctx: Oceanic.CommandInteraction | Oceanic.Message) {
        if (ctx instanceof Oceanic.Message) {
            if (ctx.channel?.type == undefined) return;
            if (ctx.channel!.type == 1) return;
            if (!ctx.content.startsWith(prefix)) return;

            const name = ctx.content.slice(prefix.length).split(" ")[0]
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