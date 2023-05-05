import { translate } from "../structures/managers/Translate.js";
import {Command, CommandOptions} from "../structures/structure/Command.js";
import {Context} from "../structures/structure/Context.js";
import * as Oceanic from "oceanic.js";

export default class Test extends Command {
    name = "test";
    description = "Test command SLASH and PREFIX of Toatrica bot.";
    aliases = ["e"];
    type = 1;
    permissions: Oceanic.PermissionName[] = ["MODERATE_MEMBERS"];
    options: CommandOptions[] = [
        {
            name: "membro",
            description: "Added member.",
            type: 6,
            argument: "MEMBER",
            error: "commands.test.options.0.error",
            required: true
        }
    ];

    async run(ctx: Context<any>) {
        ctx.send(`test | ${ctx.args[0].tag} (${ctx.args[0].id})`);
    }
}