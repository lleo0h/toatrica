import * as Oceanic from "oceanic.js";
import {Client} from "../structures/structure/Client.js";
import {Event} from "../structures/structure/Event.js";

export default class MessageCreate extends Event {
    constructor() {
        super({
            name: "messageCreate"
        });
    }

    async run(message: Oceanic.Message, client: Client) {
        client.command.run(message).catch((err) => {
            console.log(err);
        });
    }
}