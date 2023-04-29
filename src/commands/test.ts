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
            permissions: ["MODERATE_MEMBERS"]
        });
    }

    async run(ctx: Context<[String, Oceanic.Member]>) {
        ctx.send("Test command.");
    }
}