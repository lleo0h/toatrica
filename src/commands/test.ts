import {Command} from "../structure/structure/Command.js";
import {Context} from "../structure/structure/Context.js";

export default class Test extends Command {
    constructor() {
        super({
            name: "test",
            aliases: ["t"],
            description: "Test command SLASH and PREFIX of Toatrica bot.",
            type: 1
        });
    }

    async run(ctx: Context<[]>) {
        ctx.send("Test command.", {ends: true});
    }
}