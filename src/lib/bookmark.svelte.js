/* This file holds the definition of the Bookmark class,
 * alongside helper sets and functions.
 * The class has static functions for creating
 * bookmarks and folders, and manipulating it's fields.
 */

export const HEADER_TAGS = new Set(["H1", "H3"]);
export const BOOKMARK_TAGS = new Set(["A"]);
export const ALLOWED_TAGS = HEADER_TAGS.union(BOOKMARK_TAGS);

export function escapeHTML(str) {
    const replacements = [
        [/</g, '&lt;'], [/>/g, '&gt;'],
        [/&/g, '&amp;'], [/\'/g, '&#39;']
        ]; 
    let newStr = str;
    for (let r of replacements) {
        newStr = newStr.replace(r[0], r[1])
    }
    return newStr;
}

export class Bookmark {
    static #nextID = 1;
    #id
    #tag = $state("");
    attributes = $state(null);
    text = $state("");
    children = $state(null);

    static parseAttributes(element) {
        const attrObj = {};
        const baseAttr = [
            { name: "add_date", value: 0 },
            { name: "last_modified", value: 0 }
        ];
        for (const attr of element.attributes) {
                attrObj[attr.name] = attr.value;
            }
        for (const attr of baseAttr) {
            if (!attrObj[attr.name]) {
                attrObj[attr.name] = attr.value;
            }
        }
        return attrObj;
    }

    static createNewBookmark() {
        const timeNow = Math.floor(Date.now() / 1000);
        const attr = [
            { name: "href", value: "https://www.example.com/"},
            { name: "add_date", value: timeNow },
            { name: "last_modified", value: timeNow }
        ];
        const obj = {
            tagName: "A",
            attributes: attr,
            textContent: "New Bookmark",
            children: null
        }
        return new Bookmark(obj, false);
    }

    static createEmpty() {
        const zero = {
            tagName: "",
            attributes: null,
            textContent: "",
            children: null,
        }
        return new Bookmark(zero, true);
    }

    constructor(element, noID) {
        if (noID) {
            this.#id = 0;
        } else {
            this.#id = Bookmark.#nextID;
            Bookmark.#nextID++;
        }

        this.#tag = element.tagName;
        this.attributes = Bookmark.parseAttributes(element);
        this.text = element.textContent.trim();
        this.children = HEADER_TAGS.has(element.tagName) ? [] : null;
    }

    get id() {
        return this.#id;
    }

    get tag() {
        return this.#tag;
    }

    toHTMLString() {
        let attrString = "";
        for (const [key, value] of Object.entries(this.attributes)) {
            attrString += ` ${key.toUpperCase()}="${value}"`;
        }
        const escaped = escapeHTML(this.text);
        return `<${this.tag}${attrString}>${escaped}</${this.tag}>`;
    }
}