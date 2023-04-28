import * as Oceanic from "oceanic.js";
import fs from "fs";
import {Event} from "../structure/Event.js";
import {Client} from "../structure/Client.js";
import EventEmitter from "events";

interface SetOptions {
    identifier: string;
    timeout?: number;
    collected?: number;
    filter?: (...args: any) => boolean;
    once?: boolean;
}

interface Events {
    identifier: string;
    listener: () => unknown;
    timeout?: NodeJS.Timeout;
}

export class CollectorManager {
    private client: Client;
    private emitter = new EventEmitter().setMaxListeners(Infinity);
    private stops: Events[] = [];
    public events: Events[] = [];

    constructor(client: Client) {
        this.client = client;

        this.emitter.on("stop", (identifier) => {
            const indice = this.stops.findIndex(index => index.identifier == identifier);
            if (indice > -1) {
                this.stops[indice].listener();
                this.stops.splice(indice, 1);
            }
        });
    }

    public async loader(dir?: string) {
        if (dir == undefined) return;

        for (const file of fs.readdirSync(dir)) {
            const event = await import(`${dir}/${file}`)
            const Event = new event.default as Event;
            const {name, once, run} = Event;

            this.set(name, {
                identifier: name,
                once: once || false
            }, run);
        }

        console.log("Loadded events");
        return this;
    }

    public set(event: keyof Oceanic.ClientEvents, options: SetOptions, callback: (...args: any) => unknown): void {
        const client = this.client;

        if (options.once == true) {
            this.client.once(event, (..._this) => {
                if (options.filter && !options?.filter(..._this, this.client)) {
                    return;
                }
                callback(..._this, this.client);
                return;
            });
        }
        else {
            const events = this.events;
            const emitter = this.emitter;
            const indice = this.events.findIndex(index => index.identifier == options.identifier);
            if (indice > -1) return;

            function listener(..._this: any) {
                let collected = 0;

                if (options.filter && !options.filter(..._this, client)) {
                    return;
                }

                if (options.collected! <= collected) {
                    events.splice(indice, 1);
                    emitter.emit("stop", options.identifier);
                    client.removeListener(event, listener);
                    clearTimeout(timeout);
                    return;
                }
                
                collected++;
                callback(..._this, client);
            }

            let timeout: NodeJS.Timeout | undefined;
            if (options.timeout) {
                timeout = setTimeout(() => {
                    events.splice(indice, 1);
                    emitter.emit("stop", options.identifier);
                    client.removeListener(event, listener);
                }, options.timeout);
            }

            this.events.push({
                identifier: options.identifier,
                timeout,
                listener
            });

            this.client.on(event, listener);
        }
    }

    public stop(identifier: string, listener: () => unknown): void {
        const indice = this.stops.findIndex(index => index.identifier == identifier);
        if (indice == -1) this.stops.push({identifier, listener});
    }
}