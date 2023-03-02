import * as Oceanic from "oceanic.js";
import path from "path";
import url from "url";
import {CollectorManager} from "../managers/CollectorManager.js";
import {CommandManager} from "../managers/CommandManager.js";

const Intents = Oceanic.Constants.Intents;
const __dir = path.dirname(url.fileURLToPath(import.meta.url+"../../../"));

export class Client extends Oceanic.Client {
    public collector: CollectorManager = new CollectorManager(this);
    public command: CommandManager = new CommandManager(this);
    public _eventsCount?: number;
    public _events?: {
        [key in keyof Oceanic.ClientEvents]?: { listener: Function }
    }

    constructor(auth: string) {
        super({
            auth,
            gateway: {
                intents: [
                    Intents.MESSAGE_CONTENT,
                    Intents.GUILDS,
                    Intents.GUILD_MESSAGES
                ]
            }
        });
    }

    async init() {
        await this.connect();
        await this.command.loader(__dir+"/commands");
        await this.collector.loader(__dir+"/events");
        return this;
    }
}