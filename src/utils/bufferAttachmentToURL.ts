import {Attachment} from "../structure/structure/Context.js";
import * as Oceanic from "oceanic.js";

type typeAttachmentsKeys = "504b0304" | "526172211a07" | "89504e470d0a1a0a" | "ffd8ff" | "47494638" | "6674797069736f6d" | "1a45dfa3"; 

export async function bufferAttachmentToURL(attachment: Oceanic.Attachment): Promise<Attachment> {
    const typeAttachments = {
        "504b0304": "zip",
        "526172211a07": "rar",
        "89504e470d0a1a0a": "png",
        "ffd8ff": "jpg",
        "47494638": "gif",
        "6674797069736f6d": "mp4",
        "1a45dfa3": "mkv"
    }

    const response = await fetch(attachment.url);
    const buffer = Buffer.from(new Uint8Array(await response.arrayBuffer()));

    let count = 0;
    let type = ".";
    for (const key of Object.keys(typeAttachments)) {
        const hex = buffer.toString("hex").slice(0, key.length) as typeAttachmentsKeys;
        if (hex == key) type = typeAttachments[hex];
        count++;
    }

    return {
        filename: attachment.filename,
        url: attachment.url,
        type,
        buffer,
    }
}