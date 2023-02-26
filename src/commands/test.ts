import * as Oceanic from "oceanic.js";
import {Command, Context} from "../structures/structure/Command";
import {CollectorManager} from "../structures/managers/CollectorManager";

export default class Test extends Command {
    constructor() {
        super({
            name: "test",
            aliases: ["t"],
            description: "Test command SLASH and PREFIX of Toatrica bot.",
            type: 1
        });
    }

    async run(ctx: Context) {
        CollectorManager.set({
            event: "interactionCreate",
            identifier: "collector",
            async run(interaction: Oceanic.ComponentInteraction) {
                if (interaction instanceof Oceanic.ComponentInteraction) {
                    console.log(interaction);
                }
            }
        })
    }
}