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
            options: [
                {
                    name: "start",
                    description: "Write text.",
                    type: Oceanic.ApplicationCommandOptionTypes.STRING,
                    argument: "STRING"
                },
                {
                    name: "end",
                    description: "Write text.",
                    type: Oceanic.ApplicationCommandOptionTypes.STRING,
                    argument: "STRING"
                }
            ]
        });
    }

    async run(ctx: Context<[string]>) {
        ctx.send(`Test command. ${ctx.args.join(" ")}`, {ends: true});
    }
}