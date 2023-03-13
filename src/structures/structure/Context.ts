import * as Oceanic from "oceanic.js";
import {CommandOptions} from "./Command.js";

export type Response = Oceanic.CommandInteraction | Oceanic.Message;

export type Attachment = {
    filename: string;
    url: string;
    buffer: Buffer;
    type: string | undefined;
}

export class Context<T extends any[]> {
    public author: Oceanic.User;
    public guild: Oceanic.Guild;
    public args: T = [] as unknown as T; 
    public response: Response;
    public attachments: Attachment[] = [];

    constructor(ctx: Response, options?: CommandOptions[]) {
        this.guild = ctx.guild!;
        this.response = ctx;

        if (ctx instanceof Oceanic.Message) {
            this.author = ctx.author;
            for (const arg of ctx.content.split(" ").slice(1)) this.args.push(arg);
        }
        else {
            this.author = ctx.user;
            if (ctx.data?.options == undefined) return;
            
            if (options == undefined) return;
            for (const args of options) {
                const arg = ctx.data.options.raw.find(index => index.name == args.name) as Oceanic.InteractionOptionsWithValue;
                if (arg) {
                    this.args.push(arg.value);
                }
                else this.args.push(undefined);
            }
        }
    }

    public async send(content: string | Oceanic.CreateMessageOptions): Promise<Oceanic.Message> {
        if (typeof content == "object") {
            const result: Oceanic.CreateMessageOptions = {
                content: content?.content,
                embeds: content?.embeds,
                files: content?.files == undefined ? [] : content.files,
                components: content?.components
            }
    
            if (this.response instanceof Oceanic.CommandInteraction) {
                result.flags = content?.flags;
    
                if (this.response.acknowledged) {
                    return this.response.createFollowup(result);
                }
                
                this.response.createMessage(result);
                return this.response.getOriginal();
            }
            else {
                result.messageReference = {messageID: this.response.id}
                return this.response.channel!.createMessage(result);
            }
        }
        else {
            if (this.response instanceof Oceanic.CommandInteraction) {
                if (this.response.acknowledged) {
                    return this.response.createFollowup({content});
                }
                
                this.response.createMessage({content});
                return this.response.getOriginal();
            }
            else {
                return this.response.channel!.createMessage({content});
            }
        }
    }
}