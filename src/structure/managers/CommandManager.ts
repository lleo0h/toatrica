import * as Oceanic from "oceanic.js";
import fs from "fs";
import {Command} from "../structure/Command.js";
import {Context} from "../structure/Context.js";
import {Client} from "../structure/Client.js";

const prefix = "t/";

export class CommandManager {
    public commands: Map<string, Omit<Command, "name">>;
    public aliases: Map<string, Omit<Command, "name" | "type">>;
    private client: Client;

    constructor(client: Client) {
        this.commands = new Map();
        this.aliases = new Map();
        this.client = client;
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
            const context = new Context(ctx);

            if (command) {
                const argument = this.argumenthandler(command, context.args);
                
                if (argument._argumentBroken.length) {
                    ctx.channel.createMessage({content: argument._argumentBroken[0].error});
                    return;
                }
                
                await ctx.channel?.sendTyping();
                context.args = argument._arguments;
                command.run(context);
            }
        }
        else {
            const command = this.commands.get(ctx.data.name);
            const context = new Context(ctx);
            if (command) {
                context.args = this.argumenthandler(command, context.args)._arguments;
                command.run(context);
            }
        }
    }

    private argumenthandler(command: Omit<Command, "name">, argument: any[]) {
        let count = 0;
        const _arguments: any[] = [];
        const _argumentBroken: {
            value: string;
            type: string;
            error: string;
        }[] = [];

        for (const args of command.options!) {
            switch (args.type) {
                case 3: {
                    if (typeof argument[count] != "string") {
                        _argumentBroken.push({
                            value: argument[count],
                            type: "String",
                            error: "A motivo não foi definido."
                        });
                    }
                    _arguments.push(argument[count]);
                    break;
                }
                case 6: {
                    const user = this.client.users.get(argument[count]?.replace(/[<@>]/g, ""));
                    if (user == undefined) {
                        _argumentBroken.push({
                            value: argument[count],
                            type: "User",
                            error: "O usuário não foi definido."
                        });
                    }
                    _arguments.push(user);
                    break;
                }
            }
            count++;
        }
        return {
            _argumentBroken,
            _arguments
        }
    }
}