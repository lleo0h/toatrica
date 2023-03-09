import {Command} from "../structure/structure/Command.js";
import {Context} from "../structure/structure/Context.js";
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
                    name: "test",
                    description: "test",
                    type: Oceanic.ApplicationCommandOptionTypes.ROLE,
                    argument: "CHANNEL_GUILD"
                }
            ]
        });
    }

    async run(ctx: Context<[]>) {
        ctx.send("Test command.", {ends: true});
    }
}