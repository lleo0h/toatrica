import * as Oceanic from "oceanic.js";
import {Event} from "../structures";

export default class Ready extends Event {
    constructor() {
        super({
            name: "messageCreate",
        });
    }

    async run(message: Oceanic.Message) {
        if (message.content == "?test") {
            console.log("test");
        }
    }
}