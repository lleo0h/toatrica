import * as Oceanic from "oceanic.js";
import {TypeClient} from "../types/types";
import "dotenv/config";

const Intents = Oceanic.Constants.Intents;

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