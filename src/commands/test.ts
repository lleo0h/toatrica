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
        ctx.send("Collector adicionado.", {ends: true, components: [
            {
                customID: ctx.response.id,
                style: 2,
                type: 2,
                label: "collector"
            }
        ]});

        CollectorManager.set("interactionCreate", {identifier: ctx.response.id, async run(interaction: Oceanic.ComponentInteraction) {
            if (ctx.author.id != interaction.user.id) return;
            if (interaction.data.customID != ctx.response.id) return;

            interaction.channel!.createMessage({content: "test"});
        }});
    }
}