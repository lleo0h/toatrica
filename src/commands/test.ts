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
                    name: "attachment", 
                    description: "Add file.",
                    type: 11,
                    required: false,
                    argument: "ATTACHMENT"
                },
                // {
                //     name: "attachment2", 
                //     description: "Add file.",
                //     type: 11,
                //     required: true,
                //     argument: "ATTACHMENT"
                // }
            ],
            type: 1
        });
    }

    async run(ctx: Context<[]>) {
        ctx.send(".", {ends: true});
        console.log(ctx.attachments);
    }
}