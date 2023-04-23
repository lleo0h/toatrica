import * as Oceanic from "oceanic.js";
import fs from "fs";
import {Event} from "../structure/Event.js";
import {Client} from "../structure/Client.js";

interface SetOptions {
    identifier: string;
    timeout?: number;
    collected?: number;
    filter?: (...args: any) => boolean;
    once?: boolean;
}

export class CollectorManager {
    private client: Client;
    public events = [] as SetOptions[];

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

    public set(event: keyof Oceanic.ClientEvents, options: SetOptions, callback: (...args: any) => unknown) {
        const client = this.client;
        const events = this.events;

        const indice = this.events.findIndex(index => index.identifier == options.identifier);
        if (indice > -1) return;

        if (options.once == true) {
            this.client.once(event, (..._this) => {
                if (options.filter && !options?.filter(..._this, this.client)) {
                    return;
                }
                return callback(..._this, this.client);
            });
        }
        else {
            const indice = this.events.findIndex(index => index.identifier);
            
            let collected = 0;
            
            function listener(..._this: any) {
                if (options.filter && !options?.filter(..._this, client)) {
                    return;
                }

                if (options.collected! <= collected) {
                    client.removeListener(event, listener);
                    events.splice(indice, 1);
                    return;
                }
                else collected++;
                
                return callback(..._this, client);
            }

            if (options.timeout) {
                setTimeout(() => {
                    client.removeListener(event, listener);
                    events.splice(indice, 1);
                }, options.timeout);
            }

            this.events.push(options);
            this.client.on(event, listener);
        }
    }
}