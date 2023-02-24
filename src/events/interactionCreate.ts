import * as Oceanic from "oceanic.js";
import {Event} from "../structures/structure/Event";
import {CommandManager} from "../structures/managers/CommandManager";

export default class InteractionCreate extends Event {
    constructor() {
        super({
            name: "interactionCreate",
        });
    }

    async run(interaction: Oceanic.CommandInteraction) {
        if (interaction instanceof Oceanic.Interaction) {
            CommandManager.run(interaction).catch(err => {
                console.log(err);
            });
        }
    }
}