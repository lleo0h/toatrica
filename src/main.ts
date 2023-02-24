import {client} from "./structures/structure/Client";
import "./structures/managers/CollectorManager";
import "./structures/managers/CommandManager";

client.setMaxListeners(Infinity);
client.connect();