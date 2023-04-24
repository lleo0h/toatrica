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

export class CollectorManager {
    private client: Client;
    private emitter = new EventEmitter().setMaxListeners(Infinity);
    private stops: string[] = [];
    public events = [] as {
        identifier: string;
        listener: () => unknown;
        timeout?: NodeJS.Timeout;
    }[];

    constructor(client: Client) {
        this.client = client;
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
            const indice = this.events.findIndex(index => index.identifier == options.identifier);
            if (indice != -1) return;

            const events = this.events;
            const emitter = this.emitter;
            function listener(..._this: any) {
                let collected = 0;

                if (options.filter && !options.filter(..._this, client)) {
                    return;
                }

                if (options.collected! <= collected) {
                    client.removeListener(event, listener);
                    clearTimeout(timeout);
                    emitter.emit("stop");
                    events.splice(indice, 1);
                    return;
                }
                
                collected++;
                callback(..._this, client);
            }

            let timeout: NodeJS.Timeout | undefined;
            if (options.timeout) {
                timeout = setTimeout(() => {
                    client.removeListener(event, listener);
                    this.emitter.emit("stop");
                    this.events.splice(indice, 1);

                    console.log(this.events.map(index => index.identifier))
                }, options.timeout);
            }

            this.client.on(event, listener);
            this.events.push({
                identifier: options.identifier,
                timeout,
                listener
            });
        }
    }

    public stop(identifier: string, listener: () => unknown): void {
        const emitter = this.emitter;
        const events = this.events;
        const stops = this.stops;

        if (this.stops.indexOf(identifier) == -1) {
            this.stops.push(identifier);
            emitter.on("stop", function event() {
                const _event = events.find(index => index.identifier == identifier);

                if (_event) {
                    listener();
                    if (_event.timeout) {
                        clearTimeout(_event.timeout);
                    }
                    emitter.removeListener("stop", event);
                    stops.splice(stops.indexOf(identifier), 1);
                }
            });
        }
    }
}