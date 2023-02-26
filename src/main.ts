import {client} from "./structures/structure/Client";
import "./structures/managers/CommandManager";
import "./structures/managers/CollectorManager";

client.setMaxListeners(Infinity);
client.connect();