import * as Oceanic from "oceanic.js";
import fs from "fs";
import {client, TypeClient} from "../structure/Client";
import {Event} from "../structure/Event";

type CollectorManagerOptions = {
    identifier: string;
    once?: boolean;
    run(...events: any): Promise<any>;
}

class _CollectorManager {
    private client: TypeClient;
    public events: Map<keyof Oceanic.ClientEvents, Array<CollectorManagerOptions>>;

    constructor() {
        this.client = client;
        this.events = new Map();
        this.loader();
    }

    private async loader() {
        for (const file of fs.readdirSync(`${__dirname}/../../events`)) {
            const event = await import(`../../events/${file}`)
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

        if (!this.client._events[event]) {
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

    public remove({event, identifier}: Omit<CollectorManagerOptions, "run"> & {event: keyof Oceanic.ClientEvents}) {
        const _identifier = this.events.get(event)!;
        const _notDeleteEvent: Omit<CollectorManagerOptions, "event">[] = [];
        
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

export const CollectorManager = new _CollectorManager();