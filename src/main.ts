import {Client} from "./structures/structure/Client.js";
import "dotenv/config";

await new Client(`Bot ${process.env.BOT_TOKEN}`).init();