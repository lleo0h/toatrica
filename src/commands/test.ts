import {Command} from "../structures/structure/Command.js";
import {Context} from "../structures/structure/Context.js";
import * as Oceanic from "oceanic.js";

export default class Test extends Command {
    constructor() {
        super({
            name: "test",
            aliases: ["t"],
            description: "Test command SLASH and PREFIX of Toatrica bot.",
            type: 1,
            permissions: ["MODERATE_MEMBERS"],
            options: [
                {
                    name: "file",
                    description: "Added file.",
                    type: 11,
                    argument: "ATTACHMENT",
                    // error: "The \`{{argument}}\` is not a {{type}}.",
                    error: "No file was found.",
                    required: true
                }
            ]
        });
    }

    async run(ctx: Context<[Oceanic.Member]>) {
        ctx.send(`test command | ${ctx.args[0].tag} (${ctx.args[0].id})`);
    }
}