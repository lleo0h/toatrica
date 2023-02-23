import "dotenv/config";

export const settings = {
    client: {
        prefix: process.env.DEFAULT_PREFIX  || "?"
    }
}