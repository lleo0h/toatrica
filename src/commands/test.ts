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

        client.collector.set("messageReactionAdd", {identifier: "collector", timeout: 3000}, (message: Oceanic.Message, reactor: Oceanic.Member) => {
            console.log(reactor);
        });

        client.collector.stop("collector", () => {
            console.log("stop");
        });
    }
}