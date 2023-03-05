declare namespace NodeJS {
    export interface ProcessEnv {
        BOT_TOKEN: string;
    }
}

//Create the .env file in the root folder. {package.json, tsconfig, .gitignore...}