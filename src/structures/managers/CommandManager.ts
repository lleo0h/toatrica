import * as Oceanic from "oceanic.js";
import fs from "fs";
import {Command, CommandOptions} from "../structure/Command.js";
import {Context, Attachment, Response} from "../structure/Context.js";
import {Client} from "../structure/Client.js";
import {bufferAttachmentToURL} from "../../utils/bufferAttachmentToURL.js";
import {permissions_pt} from "../../utils/permissions.js";

const prefix = "t/";

export class CommandManager {
    public commands: Map<string, Command>;
    public aliases: Map<string, Command>;
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
            const Command = await import(`../../commands/${file}`);
            const command = new Command.default as Command;

            this.commands.set(command.name, command);

            if (command.aliases) {
                for (const alias of command.aliases) {
                    this.aliases.set(alias, command);
                }
            }
        }

        console.log("Loadded commands");
        return this;
    }

    public async run(ctx: Oceanic.CommandInteraction | Oceanic.Message) {
        if (ctx.channel?.type == undefined) return;
        if (ctx.channel!.type == 1) return;

        let command: Command | undefined;

        if (ctx instanceof Oceanic.Message && ctx.content.startsWith(prefix)) {
            const name = ctx.content.slice(prefix.length).split(" ")[0];
            command = this.commands.get(name) || this.aliases.get(name);

            if (command?.disablePrefix) return;
            if (command) await ctx.channel?.sendTyping();
        }
        else if (ctx instanceof Oceanic.CommandInteraction) command = this.commands.get(ctx.data.name);

        if (command) {
            if (command.permissions) {
                const member_permissions = this.permissionHandler(ctx.member!.id, ctx, command.permissions);
                const client_permissions = this.permissionHandler(ctx.client.user.id, ctx, command.permissions);

                if (ctx instanceof Oceanic.Message) {
                    if (client_permissions.length) {
                        const message = await ctx.channel.createMessage({
                            content: `Preciso ter ${client_permissions.length > 1 ? `as permissoões de ${client_permissions.reduce((acc, cur) => `\`${acc}\`, \`${cur}\``)}` : `a permissão de \`${client_permissions[0]}\` para usar executar esse comando`}.`,
                            messageReference: {messageID: ctx.id}
                        });
                        setTimeout(() => message.delete().catch(() => {}), 4500);
                        return;
                    }

                    if (member_permissions.length) {
                        const message = await ctx.channel.createMessage({
                            content: `Você precisa ${member_permissions.length > 1 ? `das permissoões de ${member_permissions.reduce((acc, cur) => `\`${acc}\`, \`${cur}\``)}` : `da permissão de \`${member_permissions[0]}\` para usar esse comando`}.`,
                            messageReference: {messageID: ctx.id}
                        });
                        setTimeout(() => message.delete().catch(() => {}), 4500);
                        return;
                    }
                }
                else if (ctx instanceof Oceanic.CommandInteraction) {
                    if (client_permissions.length) {
                        ctx.createMessage({
                            content: `Preciso ter ${client_permissions.length > 1 ? `as permissoões de ${client_permissions.reduce((acc, cur) => `\`${acc}\`, \`${cur}\``)}` : `a permissão de \`${client_permissions[0]}\` para usar executar esse comando`}.`,
                            flags: 64
                        });
                        return;
                    }

                    if (member_permissions.length) {
                        ctx.createMessage({
                            content: `Você precisa ${member_permissions.length > 1 ? `das permissoões de ${member_permissions.reduce((acc, cur) => `\`${acc}\`, \`${cur}\``)}` : `da permissão de \`${member_permissions[0]}\` para usar esse comando`}.`,
                            flags: 64
                        });
                        return;
                    }
                }
            }

            const context = new Context(ctx, command.options);
            const argument = await this.argumentHandler(ctx, context.args, command.options);

            if (argument.error.messages.length) {
                ctx.channel.createMessage({ content: argument.error.messages[0] });
                return;
            }

            context.args = argument.arguments;
            context.attachments = argument.attachments;
            command.run(context);
        }
    }

    private permissionHandler(id: string, ctx: Response, permissions: Oceanic.PermissionName[]) {
        const channel = ctx.client.getChannel(ctx.channel!.id) as Oceanic.TextableChannel;
        const member = ctx.guild!.members.get(id)!;

        const arr: string[] = [];
        for (const permission of permissions) {
            if (!channel.permissionsOf(member.id).has(permission)) {
                arr.push(permissions_pt[permission]);
            }
        }

        return arr;
    }

    private async argumentHandler(ctx: Response, content: string[], options?: CommandOptions[]) {
        const attachments: (Attachment | undefined)[] = [];
        const _arguments: unknown[] = [];

        const error = { messages: [] as string[] }

        const Argument = {
            STRING: 3,
            BOOLEAN: 5,
            USER: 6,
            MEMBER: 6,
            CHANNEL_TEXT: 7,
            CHANNEL_GUILD: 7,
            ROLE: 8,
            NUMBER: 10,
            ATTACHMENT: 11,
        }

        let count = 0;

        if (options) for (const args of options) {
            if (Argument[args.argument] != args.type) {
                throw new Error(`Type ${args.type} is not a ${args.argument}.`);
            }

            const value = content[count];

            const messageErrorRegex = args.error.replaceAll(/\{[^\}\s]+\}}/g, (text) => {
                const flags = {
                    "{{argument}}": content[count] || "undefined", //current args array
                    "{{type}}": args.argument.toLowerCase(), //current type arg
                } as Record<string, string | undefined>
                
                return flags[text] || text;
            });

            switch (args.type) {
                case 3: { //string or undefined
                    if (typeof value != "string" && args.required == true) {
                        error.messages.push(messageErrorRegex);
                    }

                    _arguments.push(value);
                    break;
                }

                case 5: { //boolean or undefined
                    let boolean: boolean | undefined;

                    if (typeof value == "boolean") boolean = value;
                    else if (value == "true") boolean = true;
                    else if (value == "false") boolean = false;

                    if (typeof boolean != "boolean" && args.required == true) {
                        error.messages.push(messageErrorRegex);
                    }
                    
                    _arguments.push(boolean);
                    break;
                }

                case 6: { //user, member or undefined
                    let user: Oceanic.User | Oceanic.Member | undefined;
                    const id = value?.replace(/[<@>]/g, "");

                    if (args.argument == "USER") user = this.client.users.get(id) || await this.client.rest.users.get(id).catch(() => undefined)
                    else if (args.argument == "MEMBER") user = this.client.guilds.get(ctx.guild!.id)?.members.get(id);

                    if (user == undefined && args.required == true) {
                        error.messages.push(messageErrorRegex);
                    }

                    _arguments.push(user);
                    break;
                }

                case 7: { //channel, textchannel or undefiend
                    let channel: Oceanic.Channel | Oceanic.TextChannel | undefined;
                    const id = value?.replace(/[<#>]/g, "");

                    if (args.argument == "CHANNEL_GUILD") channel = this.client.guilds.get(ctx.guild!.id)?.channels.get(id);
                    else if (args.argument == "CHANNEL_TEXT") channel = this.client.getChannel(id);

                    if (args.required == true && channel == undefined) {
                        error.messages.push(messageErrorRegex);
                    }
                    
                    _arguments.push(channel);
                    break;
                }

                case 8: { //role or undefined
                    const role = this.client.guilds.get(ctx.guild!.id)?.roles.get(value?.replace(/[<@&>]/g, ""));
                    if (role == undefined && args.required == true) {
                        error.messages.push(messageErrorRegex);
                    }

                    _arguments.push(role);
                    break;
                }

                case 10: { //number, NaN, or undefiend
                    if (value == undefined && args.required == true) error.messages.push(messageErrorRegex);
                    else if (isNaN(Number(value)) && args.required == true) error.messages.push(messageErrorRegex);
                    _arguments.push(Number(value));
                    break;
                }

                case 11: { //attachment custom or undefined
                    let file: Oceanic.Attachment | undefined;
                    if (ctx instanceof Oceanic.Message) file = ctx.attachments.get(value);
                    else file = ctx.data.resolved.attachments.get(value);

                    if (file == undefined && args.required == true) {
                        error.messages.push(messageErrorRegex);
                        break;
                    }
                    else if (file) {
                        attachments.push(await bufferAttachmentToURL(file));
                        _arguments.push(file.id);
                    }
                    else if (!file) {
                        attachments.push(undefined);
                        _arguments.push(undefined);
                    }

                    break;
                }
            }

            count++;
        }

        _arguments.push(...content.slice(count));
        
        return {
            error,
            attachments,
            arguments: _arguments ?? content
        }
    }
}