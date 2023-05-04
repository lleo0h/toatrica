import * as Oceanic from "oceanic.js";
import {CollectorManager} from "../managers/CollectorManager.js";
import {CommandManager} from "../managers/CommandManager.js";
import {Translate} from "../managers/Translate.js";
import {__dir} from "../../utils/__dir.js";

const Intents = Oceanic.Constants.Intents;

export class Client extends Oceanic.Client {
    public translate: Translate = new Translate(__dir);
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
                    Intents.GUILD_MESSAGES,
                    Intents.GUILD_MEMBERS,
                    Intents.GUILD_PRESENCES
                ],
                getAllUsers: true
            },
        });
    }

    async init() {
        await this.connect();
        await this.command.loader(__dir+"/commands");
        await this.collector.loader(__dir+"/events");

        return this;
    }
}