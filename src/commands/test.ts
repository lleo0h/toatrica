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
                    name: "channel",
                    description: "Add user.",
                    required: true,
                    type: Oceanic.ApplicationCommandOptionTypes.CHANNEL,
                    argument: "CHANNEL_GUILD",
                    channelTypes: [1]
                },
            ],
            type: 1
        });
    }

    async run(ctx: Context<[Oceanic.Channel]>) {
        console.log(ctx.args[0] instanceof Oceanic.VoiceChannel);
    }
}