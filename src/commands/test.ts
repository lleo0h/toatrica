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
                    name: "role",
                    description: "Add user.",
                    required: true,
                    type: Oceanic.ApplicationCommandOptionTypes.ROLE,
                    argument: "ROLE"
                },
            ],
            type: 1
        });
    }

    async run(ctx: Context<[Oceanic.Role]>) {
        console.log(ctx.args[0]);
    }
}