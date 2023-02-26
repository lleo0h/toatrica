import {Command, Context} from "../structures/structure/Command";

export default class Test extends Command {
    constructor() {
        super({
            name: "test",
            aliases: ["t"],
            description: "Test command SLASH and PREFIX of Toatrica bot.",
            type: 1
        });
    }

    async run(ctx: Context) {

    }
}