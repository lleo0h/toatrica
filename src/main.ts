import {Client} from "./structure/structure/Client.js";
import "dotenv/config";

await new Client(`Bot ${process.env.BOT_TOKEN}`).init();