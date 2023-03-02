import * as Oceanic from "oceanic.js";
import {Client} from "../structure/structure/Client.js";
import {Event} from "../structure/structure/Event.js";

export default class Ready extends Event {
    constructor() {
        super({
            name: "ready"
        });
    }

    async run(client: Client) {
        const registerSlashBulk: Oceanic.CreateApplicationCommandOptions[] = [];
        
        for (const command of client.command.commands) {
            if (!command[1].disableSlash) registerSlashBulk.push({
                name: command[0],
                options: command[1].options,
                description: command[1].description!,
                type: command[1].type!
            });
        }

        await client.application.bulkEditGlobalCommands(registerSlashBulk).then(() => console.log("Loadded slash commands"));
        console.log(`${client.user.username}#${client.user.discriminator} (${client.user.id}) is logged.`);
    }
}