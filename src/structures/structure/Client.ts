import * as Oceanic from "oceanic.js";
import "dotenv/config";

const Intents = Oceanic.Constants.Intents;

export type TypeClient = Oceanic.Client & {
    _events: {
        [key in keyof Oceanic.ClientEvents]?: {
            listener: Function;
        }
    },
    _eventsCount: Number;
}

export const client = new Oceanic.Client({
    auth: `Bot ${process.env.BOT_TOKEN}`,
    gateway: {
        intents: [
            Intents.MESSAGE_CONTENT,
            Intents.GUILDS,
            Intents.GUILD_MESSAGES
        ]
    }
}) as TypeClient;

client.setMaxListeners(Infinity);
client.connect();