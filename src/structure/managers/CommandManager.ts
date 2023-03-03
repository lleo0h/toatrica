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

        if (command.options == undefined) {
            return {
                _argumentBroken,
                _arguments: argument
            }
        }

        for (const args of command.options) {
            const value = argument[count];
            switch (args.argument) {
                case "STRING": case "REASON": case "TIME": {
                    if (typeof value != "string" && args.required) {
                        const td = {
                            STRING: "O texto não foi **definido**.",
                            REASON: "O motivo não foi **definido**.",
                            TIME: "O tempo não foi **definido**."
                        }
                        _argumentBroken.push(td[args.argument]);
                    }
                    _arguments.push(value);
                    break;
                }

                case "BOOLEAN": {
                    let boolean: Boolean | undefined;
                    if (value == "true") boolean = true;
                    else if (value == "false") boolean = false;
                    else if (typeof value == "boolean") boolean = value;

                    if (typeof boolean != "boolean" && args.required) {
                        _argumentBroken.push("Você não escolheu entre **verdadeiro** ou **falso**.");
                    }
                    _arguments.push(boolean);
                    break;
                }

                case "USER": case "MEMBER": {
                    let user: Oceanic.User | Oceanic.Member | undefined;
                    const id = value?.replace(/[<@>]/g, "");

                    if (args.argument == "USER") user = this.client.users.get(id);
                    else if (args.argument == "MEMBER") user = this.client.guilds.get(guild)?.members.get(id);
                    
                    if (id) {
                        if (user == undefined && args.required) {
                            _argumentBroken.push(`O ${args.argument == "USER" ? "usuário" : "membro"} \`${value}\` não foi **encontrado**.`);
                        }
                    }
                    else {
                        _argumentBroken.push(`O ${args.argument == "USER" ? "usuário" : "membro"} não foi **definido**.`);
                    }
                    _arguments.push(user); //User and undefined value.
                    break;
                }

                case "CHANNEL_GUILD": case "CHANNEL_TEXT": {
                    let channel: Oceanic.Channel | Oceanic.TextChannel | undefined;
                    const id = value?.replace(/[<#>]/g, "");

                    if (id) {
                        if (args.argument == "CHANNEL_GUILD") channel = this.client.guilds.get(guild)?.channels.get(id);
                        else if (args.argument == "CHANNEL_TEXT") channel = this.client.getChannel(id);
                        if (channel == undefined && args.required) _argumentBroken.push("O canal não foi **encontrado**.");
                    }
                    else if (args.required) {
                        _argumentBroken.push("O canal não foi **definido**.");
                    }
                    _arguments.push(channel); //Channel and undefined value.
                    break;
                }

                case "ROLE": {
                    let role: Oceanic.Role | undefined;
                    const id = value?.replace(/[<@&>]/g, "");
                    
                    if (id) {
                        role = this.client.guilds.get(guild)?.roles.get(id);
                        if (role == undefined && args.required) {
                            _argumentBroken.push("O cargo não foi **encontrado**.");
                        } 
                    }
                    else if (args.required) {
                        _argumentBroken.push("O cargo não foi **definido**.");
                    }
                    _arguments.push(role); //Role and undefined value.
                    break;
                }
                
                case "NUMBER": {
                    if (value == undefined && args.required) _argumentBroken.push("O número não foi **definido**.")
                    else if (isNaN(value) && args.required) _argumentBroken.push(`O valor \`${value}\` não é um número.`)
                    _arguments.push(Number(value)); //Number and NaN value
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