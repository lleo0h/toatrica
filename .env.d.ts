declare namespace NodeJS {
    export interface ProcessEnv {
        BOT_TOKEN: string;
        NODE_ENV: string;
    }
}

//Create the .env file in the root folder. {package.json, tsconfig, .gitignore...}