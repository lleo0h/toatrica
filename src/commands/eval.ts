import util from "util"; 
import {Command} from "../structure/structure/Command.js";
import {Context} from "../structure/structure/Context.js";

export default class Eval extends Command {
    constructor() {
        super({
            name: "eval",
            aliases: ["e"],
            disableSlash: true,
            type: 1
        });
    }

    async run(ctx: Context<[]>) {
        if (ctx.author.id != "468191831759388682") return;

        try {
            const code = ctx.args.join(" ");
            const result = eval(code);
            
            if (result instanceof Promise) await result.catch((e) => {
                ctx.send(`\`\`\`js\n${e}\`\`\``);
            });

            ctx.send(`\`\`\`js\n${util.inspect(result, {depth: 0})}\`\`\``);
        }

        catch (e) {
            ctx.send(`\`\`\`js\n${e}\`\`\``);
        }
    }
}