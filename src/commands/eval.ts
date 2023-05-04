import util from "util"; 
import {Command} from "../structures/structure/Command.js";
import {Context} from "../structures/structure/Context.js";

export default class Eval extends Command {
    name = "eval";
    aliases = ["e"];
    disableSlash = true;
    type = 1;

    async run(ctx: Context<[]>) {
        if (ctx.author.id != "468191831759388682") return;

        try {
            const code = ctx.args.join(" ");
            let result = eval(code);
            
            if (result instanceof Promise) result = await result.catch((e) => {
                ctx.send(`\`\`\`js\n${e}\`\`\``);
            });

            ctx.send(`\`\`\`js\n${util.inspect(result, {depth: 0})}\`\`\``).catch((e) => {
                ctx.send(`\`\`\`js\n${e}\`\`\``);
            });
        }

        catch (e) {
            ctx.send(`\`\`\`js\n${e}\`\`\``);
        }
    }
}