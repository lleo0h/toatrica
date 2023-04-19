import {Command} from "../structures/structure/Command.js";
import {Context} from "../structures/structure/Context.js";
import * as Oceanic from "oceanic.js";

export default class Test extends Command {
    constructor() {
        super({
            name: "test",
            aliases: ["t"],
            options: [
                {
                    name: "file",
                    description: "set file",
                    type: 11,
                    argument: "ATTACHMENT"
                },
                {
                    name: "boolean",
                    description: "set boolean",
                    type: 5,
                    argument: "BOOLEAN"
                },
                {
                    name: "reason",
                    description: "set text",
                    type: 3,
                    argument: "REASON"
                },
                {
                    name: "user",
                    description: "set text",
                    type: 6,
                    argument: "USER"
                }
            ],
            description: "Test command SLASH and PREFIX of Toatrica bot.",
            type: 1
        });
    }

    async run(ctx: Context<[String, Oceanic.Member]>) {
        // console.log(ctx.args);
        // console.log(ctx.attachments);
    }
}