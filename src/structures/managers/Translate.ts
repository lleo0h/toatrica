import fs from "fs";

export class Translate {
    public translate: Record<string, any> = {}

    constructor(path: string) {
        for (const file of fs.readdirSync(path+"/assets/locales")) {
            const json = JSON.parse(fs.readFileSync(path+"/assets/locales/"+file).toString()) as unknown as object;
            this.translate[file.split(".")[0]] = json;
        }
    }

    t(path: string, translate: "pt" | "en"): object | string {
        let obj: Record<string, any> = this.translate[translate];
        for (const p of path.split(".")) {
            obj = obj[p];
        }

        return obj;
    }
}

