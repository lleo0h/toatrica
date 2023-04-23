import {Client} from "../structures/structure/Client.js";
import {Command} from "../structures/structure/Command.js";
import {Context} from "../structures/structure/Context.js";
import * as Oceanic from "oceanic.js";

export default class Test extends Command {
    constructor() {
        super({
            name: "test",
            aliases: ["t"],
            description: "Test command SLASH and PREFIX of Toatrica bot.",
            type: 1
        });
    }

    async run(ctx: Context<[String, Oceanic.Member]>) {
        const client = ctx.response.client as Client;
        
        const options = {
            identifier: "messageReactionAdd",
            // collected: 50,
            // timeout: 50000,
            // filter(message: Oceanic.Message) {
            //     return message.author.id != ctx.response.id;
            // }
        }

        client.collector.set("messageReactionAdd", options, (message: Oceanic.Message, reactor: Oceanic.Member) => {
            console.log(reactor);
        });

        console.log(client.collector.events)
    }
}