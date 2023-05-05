import fs from "fs";
import {__dir} from "../../utils/constants.js";

export type Locales = "pt" | "en";

type TranslateObject = Record<string, object | Array<string | object>>

export class Translate {
    public translate: TranslateObject  = {}

    constructor(path: string) {
        for (const file of fs.readdirSync(path+"/assets/locales")) {
            const json = JSON.parse(fs.readFileSync(path+"/assets/locales/"+file).toString()) as unknown as object;
            this.translate[file.split(".")[0]] = json;
        }
    }

    t(path: string, locales: Locales): object | Array<string> | string | undefined {
        let td = this.translate[locales] as TranslateObject;
        for (const p of path.split(".")) {
            td = td[p] as TranslateObject;
        }
        return td;
    }
}

export const translate = new Translate(__dir);