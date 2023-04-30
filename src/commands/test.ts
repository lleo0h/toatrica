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
                    name: "member",
                    description: "Added member.",
                    type: 6,
                    argument: "MEMBER",
                    error: "The {{argument}} not {{type}}.",
                    required: true
                }
            ]
        });
    }

    async run(ctx: Context<[Oceanic.Member]>) {
        ctx.send(`test command | ${ctx.args[0].tag} (${ctx.args[0].id})`);
    }
}