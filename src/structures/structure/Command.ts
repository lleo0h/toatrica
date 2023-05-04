import * as Oceanic from "oceanic.js";
import {Context} from "./Context.js";

export const Argument = {
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

export type CommandOptions = Oceanic.ApplicationCommandOptions & {
    argument: keyof typeof Argument;
    error: string;
}

export class Command {
    public name?: string;
    public description?: string;   
    public aliases?: string[];
    public options?: CommandOptions[];
    public type?: Oceanic.ApplicationCommandTypes;
    public disableSlash?: boolean;
    public disablePrefix?: boolean;
    public permissions?: Array<Oceanic.Constants.PermissionName>

    async run(ctx: Context<any>): Promise<any>{};
}