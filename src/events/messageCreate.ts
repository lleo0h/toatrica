import * as Oceanic from "oceanic.js";
import {Event} from "../structures/structure/Event";
import {CommandManager} from "../structures/managers/CommandManager";

export default class MessageCreate extends Event {
    constructor() {
        super({
            name: "messageCreate",
        });
    }

    async run(message: Oceanic.Message) {
        CommandManager.run(message).catch(err => {
            console.log(err);
        });
    }
}