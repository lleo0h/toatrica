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
                    type: Oceanic.ApplicationCommandOptionTypes.STRING,
                    argument: "STRING"
                }
            ]
        });
    }

    async run(ctx: Context<[string]>) {
        ctx.send("Test command.", {ends: true});
        console.log(ctx.args)
    }
}