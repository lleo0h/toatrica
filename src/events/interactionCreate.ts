import * as Oceanic from "oceanic.js";
import {Client} from "../structures/structure/Client.js";
import {Event} from "../structures/structure/Event.js";

export default class InteractionCreate extends Event {
    constructor() {
        super({
            name: "interactionCreate"
        });
    }

    async run(interaction: Oceanic.Interaction, client: Client) {
        if (interaction instanceof Oceanic.CommandInteraction) {
            client.command.run(interaction).catch(err => {
                console.log(err);
            });
        }
    }
}