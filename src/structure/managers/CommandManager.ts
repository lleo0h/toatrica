import * as Oceanic from "oceanic.js";
import fs from "fs";
import {Command, Argument} from "../structure/Command.js";
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
                const argument = this.argumenthandler(command, context.args, context.guild.id);
                
                if (argument._argumentBroken.length) {
                    ctx.channel.createMessage({content: argument._argumentBroken[0]});
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
                context.args = this.argumenthandler(command, context.args, context.guild.id)._arguments;
                command.run(context);
            }
        }
    }

    private argumenthandler(command: Omit<Command, "name">, argument: any[], guild: string) {
        const _arguments: any[] = [];
        const _argumentBroken: string[] = [];
        let count = 0;

        for (const args of command.options!) {
            const value = argument[count];
            switch (args.type) {
                case 3: {
                    if (typeof value != "string") {
                        if (args.required) {
                            _argumentBroken.push(`O ${args.argument == "REASON" ? "motivo" : "texto"} não foi definido.`);
                        }
                    }
                    _arguments.push(value);
                    break;
                }

                case 5: {
                    let _boolean: Boolean | undefined;
                    if (value == "true") _boolean = true;
                    else if (value == "false") _boolean = false;
                    else if (typeof value == "boolean") _boolean = value;
                    if (typeof _boolean != "boolean") {
                        if (args.required) {
                            _argumentBroken.push("Você não escolheu entre verdadeiro & falso.");
                        }
                    }
                    _arguments.push(_boolean);
                    break;
                }

                case 6: {
                    const id = value?.replace(/[<@>]/g, "");
                    let user: Oceanic.User | Oceanic.Member | undefined;
                    if (args.argument == "USER") user = this.client.users.get(id);
                    else if (args.argument == "MEMBER") user = this.client.guilds.get(guild)?.members.get(id);
                    if (id) {
                        if (user == undefined && args.required) {
                            _argumentBroken.push(`O ${args.argument == "USER" ? "usuário" : "membro"} não foi encontrado.`);
                        }
                    }
                    else _argumentBroken.push(`O ${args.argument == "USER" ? "usuário" : "membro"} não foi definido.`);
                    _arguments.push(user);
                    break;
                }

                case 7: {
                    let channel: Oceanic.Channel | Oceanic.TextChannel | undefined;
                    const id = value?.replace(/[<#>]/g, "");

                    if (id) {
                        if (args.argument == "CHANNEL_GUILD") channel = this.client.guilds.get(guild)?.channels.get(id);
                        else if (args.argument == "CHANNEL_TEXT") channel = this.client.getChannel(id);
                        if (channel == undefined) _argumentBroken.push("O canal não foi encontrado.");
                    }
                    else _argumentBroken.push("O canal não foi definido.");
                    _arguments.push(channel);
                    break;
                }

                case 8: {
                    let role: Oceanic.Role | undefined;
                    const id = value?.replace(/[<@&>]/g, "");
                    
                    if (id) {
                        role = this.client.guilds.get(guild)?.roles.get(id);
                        if (role == undefined) {
                            _argumentBroken.push("O cargo não foi encontrado.");
                        } 
                    }
                    else _argumentBroken.push("O cargo não foi definido.");
                    _arguments.push(role);
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