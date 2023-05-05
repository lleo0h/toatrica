type FlagsOptions = {
    key: string;
    value: string | undefined;
}

export function flags(message: string, regex: RegExp, ...options: FlagsOptions[]) {
    let count = 0;
    return message.replaceAll(regex, () => {
        const result = options[count].value ?? "undefined";
        count++;

        return result;
    });
}
