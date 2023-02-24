import {Command} from "../structures/structure/Command";
import {TypeCommandContext} from "../structures/types/types";
import fs from "fs";
import path from "path";
export default class Test extends Command {
    constructor() {
        super({
            name: "test",
            aliases: ["t"],
            description: "Test command SLASH and PREFIX of Toatrica bot.",
            type: 1
        });
    }

    async run(ctx: TypeCommandContext) {
        ctx.send("test", {components: [
            {
                label: "test",
                customID: "test2",
                style: 2,
                type: 2
            },
            {
                label: "test",
                customID: "test4",
                style: 2,
                type: 2
            },
            {
                label: "test",
                customID: "test3",
                style: 2,
                type: 2
            },
            {
                label: "test",
                customID: "test5",
                style: 2,
                type: 2
            },
            {
                label: "test",
                customID: "test6",
                style: 2,
                type: 2
            },
        ]})
    }
}