import * as Oceanic from "oceanic.js";
import {Context} from "./Context.js";

export type Argument = "STRING" | "NUMBER" | "BOOLEAN" | "DATE" | "ANY" | "MEMBER" | "USER" | "CHANNEL_GUILD" | "CHANNEL_TEXT" | "ROLE" | "ATTACHMENT";

export type CommandOptions = Oceanic.ApplicationCommandOptions & {
    argument: Argument;
    error: string;
}

export class Command {
    public name: string;
    public description?: string;   
    public aliases?: string[];
    public options?: CommandOptions[];
    public type?: Oceanic.ApplicationCommandTypes;
    public disableSlash?: boolean;
    public disablePrefix?: boolean;
    public permissions?: Array<Oceanic.Constants.PermissionName>

    constructor({name, aliases, description, options, type, disableSlash, disablePrefix, permissions}: Omit<Command, "run">) {
        this.name = name;
        this.aliases = aliases;
        this.description = description;
        this.options = options;
        this.type = type;
        this.disableSlash = disableSlash;
        this.disablePrefix = disablePrefix;
        this.permissions = permissions;
    }

    async run(ctx: Context<any>): Promise<any>{};
}