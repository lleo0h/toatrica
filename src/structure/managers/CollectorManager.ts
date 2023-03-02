import * as Oceanic from "oceanic.js";
import fs from "fs";
import {Event} from "../structure/Event.js";
import {Client} from "../structure/Client.js";

interface CollectorManagerOptions extends Omit<Event, "name">{
    identifier: string;
}

export class CollectorManager {
    public events = new Map<keyof Oceanic.ClientEvents, CollectorManagerOptions[]>();
    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async loader(dir?: string) {
        if (dir == undefined) return;

        for (const file of fs.readdirSync(dir)) {
            const event = await import(`${dir}/${file}`)
            const Event = new event.default as Event;
            const {name, once, run} = Event;
    
            if (Event.once) this.set(name, {
                identifier: name,
                once,
                run
            });
            else this.set(name, {
                identifier: name,
                run
            });
        }

        console.log("Loadded events");
        return this;
    }

    public set(event: keyof Oceanic.ClientEvents, {identifier, once, run}: CollectorManagerOptions) {
        if (this.events.has(event)) {
            const array = this.events.get(event)!;
            if (array.find(index => index.identifier == identifier)) return;

            this.events.set(event, [...array, {
                identifier,
                run
            }]);
        }
        else this.events.set(event, [{
            identifier,
            run
        }]);

        if (!this.client._events || !this.client._events[event]) {
            if (once) {
                this.client.once(event, (..._this) => {
                    for (const _event of this.events.get(event)!) {
                        _event.run(..._this, this.client);
                    }
                });
            }
            else {
                this.client.on(event, (..._this) => {
                    for (const _event of this.events.get(event)!) {
                        _event.run(..._this, this.client);
                    }
                });
            }
        }
    }

    public remove(event: keyof Oceanic.ClientEvents, {identifier}: Omit<CollectorManagerOptions, "run">) {
        const _identifier = this.events.get(event);
        const _notDeleteEvent: CollectorManagerOptions[] = [];

        if (_identifier == undefined) return;

        for (const i of _identifier) {
            if (i.identifier != identifier) {
                const {identifier, run} = i;
                _notDeleteEvent.push({
                    identifier,
                    run
                });
            }
        }

        this.events.set(event, _notDeleteEvent);
    }
}