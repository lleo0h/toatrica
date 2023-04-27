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
        if (ctx instanceof Oceanic.Message) {
            if (ctx.channel?.type == undefined) return;
            if (ctx.channel!.type == 1) return;
            if (!ctx.content.startsWith(prefix)) return;

            const name = ctx.content.slice(prefix.length).split(" ")[0];
            const command = this.commands.get(name) || this.aliases.get(name);
            if (command && !command.disablePrefix) {
                if (command.permissions) { //added later an option to disable the notification
                    const member_permissions = this.permissionHandler(ctx.member!.id, ctx, command.permissions);
                    const client_permissions = this.permissionHandler(ctx.client.user.id, ctx, command.permissions);

                    if (client_permissions.length) {
                        const message = await ctx.channel.createMessage({
                            content: `Eu não tenho ${client_permissions.length > 1 ? `as permissoões de ${client_permissions.reduce((acc, cur) => `\`${acc}\`, \`${cur}\``)}` : `a permissão de \`${member_permissions[0]}\` para usar executar esse comando`}.`,
                            messageReference: {messageID: ctx.id}
                        });
                        setTimeout(() => message.delete().catch(() => {}), 3000);
                        return;
                    }

                    if (member_permissions.length) {
                        const message = await ctx.channel.createMessage({
                            content: `Você precisa ${member_permissions.length > 1 ? `das permissoões de ${member_permissions.reduce((acc, cur) => `\`${acc}\`, \`${cur}\``)}` : `da permissão de \`${member_permissions[0]}\` para usar esse comando`}.`,
                            messageReference: {messageID: ctx.id}
                        });
                        setTimeout(() => message.delete().catch(() => {}), 3000);
                        return;
                    }
                }
            
                const context = new Context(ctx, command.options);
                const argument = await this.argumentHandler(ctx, context.args, command.options);

                if (argument._errors.length) {
                    ctx.channel.createMessage({ content: argument._errors[0] });
                    return;
                }

                await ctx.channel?.sendTyping();
                context.args = argument._arguments;
                context.attachments = argument._attachments;
                command.run(context);
            }
        }
        else {
            const command = this.commands.get(ctx.data.name);
            if (command) {
                if (command.permissions) {
                    const member_permissions = this.permissionHandler(ctx.member!.id, ctx, command.permissions);
                    const client_permissions = this.permissionHandler(ctx.client.user.id, ctx, command.permissions);

                    if (client_permissions.length) {
                        ctx.createMessage({
                            content: `Eu não tenho ${client_permissions.length > 1 ? `as permissoões de ${client_permissions.reduce((acc, cur) => `\`${acc}\`, \`${cur}\``)}` : `a permissão de \`${member_permissions[0]}\` para usar executar esse comando`}.`,
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

                const context = new Context(ctx, command.options);
                const argument = await this.argumentHandler(ctx, context.args, command.options);
                context.args = argument._arguments;
                context.attachments = argument._attachments;
                command.run(context);
            }
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

        for (const permission of permissions) {
            if (!arr.includes(permission)) continue;
            if (!member.permissions.has(permission)) {
                arr.push(permissions_pt[permission]);
            }
        }

        return arr;
    }

    private async argumentHandler(ctx: Response, argument: string[], options?: CommandOptions[]) {
        //The argument handler just return the value and it has definition error.
        const _arguments: unknown[] = [];
        const _errors: string[] = [];
        const _attachments: (Attachment | undefined)[] = [];

        const ctxArrFiles: Oceanic.Attachment[] = [];
        if (ctx instanceof Oceanic.Message) {
            for (const file of ctx.attachments) {
                ctxArrFiles.push(file[1]);
            }
        }
        else if (ctx instanceof Oceanic.CommandInteraction) {
            for (const file of ctx.data.resolved.attachments) {
                ctxArrFiles.push(file[1]);
            }
        }

        let count = 0;
        let countAttachment = 0;

        if (options == undefined) {
            return {
                _errors,
                _attachments,
                _arguments: argument
            }
        }

        for (const args of options) {
            const value = argument[count];
            switch (args.type) {
                case 3: {
                    if (typeof value != "string" && args.required == true && args.argument != "ANY") {
                        const td = {
                            STRING: "O texto não foi **definido**.",
                            REASON: "O motivo não foi **definido**.",
                            TIME: "O tempo não foi **definido**."
                        }
                        _errors.push(td[value as "STRING" | "REASON" | "TIME"]);
                    }

                    _arguments.push(value); //String or undefined value.
                    break;
                }

                case 5: {
                    let boolean: Boolean | undefined;
                    if (value == "true") boolean = true;
                    else if (value == "false") boolean = false;
                    else if (typeof value == "boolean") boolean = value;

                    if (typeof boolean != "boolean" && args.required == true) {
                        _errors.push("Você não escolheu entre **verdadeiro** ou **falso**.");
                    }
                    _arguments.push(boolean); //Boolean or undefined value.
                    break;
                }

                case 6: {
                    let user: Oceanic.User | Oceanic.Member | undefined;
                    const id = value?.replace(/[<@>]/g, "");

                    if (args.argument == "USER") user = this.client.users.get(id);
                    else if (args.argument == "MEMBER") user = this.client.guilds.get(ctx.guild!.id)?.members.get(id);

                    if (id) {
                        if (user == undefined && args.required == true) {
                            _errors.push(`O ${args.argument == "USER" ? "usuário" : "membro"} \`${value}\` não foi **encontrado**.`);
                        }
                    }
                    else if (args.required) {
                        _errors.push(`O ${args.argument == "USER" ? "usuário" : "membro"} não foi **definido**.`);
                    }
                    _arguments.push(user); //User or Member or undefined value.
                    break;
                }

                case 7: {
                    let channel: Oceanic.Channel | Oceanic.TextChannel | undefined;
                    const id = value?.replace(/[<#>]/g, "");

                    if (id) {
                        if (args.argument == "CHANNEL_GUILD") channel = this.client.guilds.get(ctx.guild!.id)?.channels.get(id);
                        else if (args.argument == "CHANNEL_TEXT") channel = this.client.getChannel(id);
                        if (channel == undefined && args.required == true) _errors.push("O canal não foi **encontrado**.");
                    }
                    else if (args.required) {
                        _errors.push("O canal não foi **definido**.");
                    }
                    _arguments.push(channel); //ChannelGuild or ChannelText or undefined value.
                    break;
                }

                case 8: {
                    let role: Oceanic.Role | undefined;
                    const id = value?.replace(/[<@&>]/g, "");

                    if (id) {
                        role = this.client.guilds.get(ctx.guild!.id)?.roles.get(id);
                        if (role == undefined && args.required == true) {
                            _errors.push("O cargo não foi **encontrado**.");
                        }
                    }
                    else if (args.required) {
                        _errors.push("O cargo não foi **definido**.");
                    }
                    _arguments.push(role); //Role or undefined value.
                    break;
                }

                case 10: {
                    if (value == undefined && args.required == true) _errors.push("O número não foi **definido**.");
                    else if (isNaN(Number(value)) && args.required == true) _errors.push(`O valor \`${value}\` não é um número.`);
                    _arguments.push(Number(value)); //Number or NaN value.
                    break;
                }

                case 11: { //Attachment custom or undefined value.
                    const file = ctxArrFiles[countAttachment];
                    if (file == undefined && args.required == true) {
                        _errors.push(`O arquivo não foi **definido**.`);
                        break;
                    }
                    else if (file) {
                        _attachments.push(await bufferAttachmentToURL(file));
                        _arguments.push(file.id);
                    }
                    else if (!file) {
                        _attachments.push(undefined);
                        _arguments.push(undefined);
                    }
                    countAttachment++;
                    break;
                }
            }

            count++;
        }

        if (options[count-1].argument == "REASON" || options[count-1].argument == "ANY") {
            _arguments.push(...argument.slice(count));
        }

        return {
            _errors,
            _attachments,
            _arguments
        }
    }
}