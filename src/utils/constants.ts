import path from "path";
import url from "url";

export const __dir = path.dirname(url.fileURLToPath(import.meta.url+"../../"));

export const flagsRegex = /\{[^\}\s]+\}}/g;