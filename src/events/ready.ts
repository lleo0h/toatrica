import * as Oceanic from "oceanic.js";
import {Event} from "../structures/structure/Event";
import {CommandManager} from "../structures/managers/CommandManager";

export default class Ready extends Event {
    constructor() {
        super({
            name: "ready",
        });
    }

    async run(client: Oceanic.Client) {
        const registerSlashBulk: Oceanic.CreateApplicationCommandOptions[] = [];
        for (const command of CommandManager.commands) {
            if (!command[1].disableSlash) {
                registerSlashBulk.push({
                    name: command[0],
                    description: command[1].description!,
                    options: command[1].options,
                    type: command[1].type
                });
            }
        }

        await client.application.bulkEditGlobalCommands(registerSlashBulk).then(() => console.log("Loadded slash commands"));
        console.log(`${client.user.username}#${client.user.discriminator} (${client.user.id}) is logged.`);
    }
}