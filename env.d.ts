declare namespace NodeJS {
    export interface ProcessEnv {
        BOT_TOKEN: string;
        DATABASE_URI: string;
    }
}

//Create the .env file in the root folder. {package.json, tsconfig, .gitignore...}