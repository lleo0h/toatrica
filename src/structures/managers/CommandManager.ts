import fs from "fs";
import {TypeCommand} from "../structure/Command";

class _CommandManager {
    public commands: Map<string, Omit<TypeCommand, "name">>

    constructor() {
        this.commands = new Map();
        this.loader();
    }

    private async loader() {
        for (const file of fs.readdirSync(`${__dirname}/../../commands`)) {
            const command = await import(`../../commands/${file}`);
            const Command = new command.default as TypeCommand;

            this.commands.set(Command.name, {
                aliases: Command.aliases,
                description: Command.description,
                options: Command.options,
                type: Command.type,
                run: Command.run
            });
        }

        console.log("Loadded commands");
    }
}

export const CommandManager = new _CommandManager();