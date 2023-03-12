import * as Oceanic from "oceanic.js";

export class Embed {
    public title?: string;
    public description?: string;
    public type?: Oceanic.EmbedType;
    public url?: string;
    public color?: number; 
    public timestamp?: string;
    public image?: Oceanic.EmbedImage;
    public footer?: Oceanic.EmbedFooter;
    public author?: Oceanic.EmbedAuthor;
    public fields: Oceanic.EmbedField[] = [];
    public thumbnail?: Oceanic.EmbedImageOptions;

    public setAuthor(name: string, iconURL?: string, url?: string) {
        this.author = {name, iconURL, url}
        return this;
    }

    public setTitle(title: string) {
        this.title = title;
        return this;
    }

    public setDescription(description: string) {
        this.description = description;
        return this;
    }

    public setImage(url: string, height?: number, width?: number) {
        this.image = {url, height, width}
        return this
    }

    public setURL(url: string) {
        this.url = url;
        return this;
    }

    public setColorHex(color: string) {
        this.color == parseInt(color.toUpperCase().replace("#", ""), 16);
        return this;
    }
    
    public setColorRGB(r: number, g: number, b: number) {
        this.color = (r << 16) + (g << 8) + (b);
        return this;
    }

    public setType(type: Oceanic.EmbedType) {
        this.type = type;
        return this;
    }

    public setThumbnail(url: string) {
        this.thumbnail = {url}
    }

    public addField({name, value, inline}: Oceanic.EmbedField) {
        this.fields.push({name, value, inline});
        return this; 
    }

    public setFooter(text: string, iconURL?: string) {
        this.footer = { text, iconURL }
        return this;
    }

    public setTimestamp() {
        this.timestamp = String(Date.now());
        return this;
    }
}

new Embed();