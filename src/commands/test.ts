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
                    name: "boolean",
                    description: "Add user.",
                    required: true,
                    type: Oceanic.ApplicationCommandOptionTypes.BOOLEAN,
                    argument: "BOOLEAN"
                },
            ],
            type: 1
        });
    }

    async run(ctx: Context<[boolean]>) {
        console.log(ctx.args)
    }
}