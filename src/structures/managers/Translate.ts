import fs from "fs";
import {__dir} from "../../utils/__dir.js";

export class Translate {
    public translate: Record<string, object | Array<string>> = {}

    constructor(path: string) {
        for (const file of fs.readdirSync(path+"/assets/locales")) {
            const json = JSON.parse(fs.readFileSync(path+"/assets/locales/"+file).toString()) as unknown as object;
            this.translate[file.split(".")[0]] = json;
        }
    }

    t(path: string, translate: "pt" | "en"): object | Array<string> | string | undefined {
        let td = this.translate[translate] as Record<string, string | object | Array<string>>;
        for (const p of path.split(".")) {
            td = td[p] as Record<string, object | string>;
        }
        return td;
    }
}

export const translate = new Translate(__dir);