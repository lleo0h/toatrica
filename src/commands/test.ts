import {Command} from "../structures/structure/Command.js";
import {Context} from "../structures/structure/Context.js";

export default class Test extends Command {
    constructor() {
        super({
            name: "test",
            aliases: ["t"],
            description: "Test command SLASH and PREFIX of Toatrica bot.",
            type: 1
        });
    }

    async run(ctx: Context<[string]>) {
        ctx.send({content: "Test command.", flags: 64});
    }
}