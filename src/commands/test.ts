import * as Oceanic from "oceanic.js";
import {Command} from "../structure/structure/Command.js";
import {Context} from "../structure/structure/Context.js";

export default class Test extends Command {
    constructor() {
        super({
            name: "test",
            aliases: ["t"],
            description: "Test command SLASH and PREFIX of Toatrica bot.",
            options: [
                {
                    name: "user",
                    description: "Add user.",
                    type: Oceanic.ApplicationCommandOptionTypes.USER,
                    required: true
                },
                {
                    name: "text",
                    description: "Add text.",
                    type: Oceanic.ApplicationCommandOptionTypes.STRING,
                    required: true
                }
            ],
            type: 1
        });
    }

    async run(ctx: Context<[Oceanic.User, string]>) {
        ctx.send(`User: ${ctx.args[0].username} | Reason: ${ctx.args[1]}`, {ends: true});
    }
}