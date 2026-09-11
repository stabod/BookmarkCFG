import { HEADER_TAGS, ELEMENT_TAG, ALLOWED_TAGS, escapeHTML } from "./html-utills";

class BookmarkFrame {

    node = null;
    visited = null;
    depth = null;

    constructor(node, depth) {
        this.node = node;
        if (node.children) {
            this.visited = false;
        }
        this.depth = depth;    
    }

    visit() {
        this.visited = true;
    }

    fromChildren() {
        if (!this.node.children) return [];
        const arr = [];
        for (const node of this.node.children.toReversed()) {
            arr.push(new BookmarkFrame(node, this.depth+1));
        }
        return arr;
    }
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

    static resetID() {
        this.#nextID = 1;
    }

    static newBookmark() {
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

    static newFolder() {
      const timeNow = Math.floor(Date.now() / 1000);
        const attr = [
            { name: "add_date", value: timeNow },
            { name: "last_modified", value: timeNow }
        ];
        const obj = {
            tagName: "H3",
            attributes: attr,
            textContent: "New Folder",
            children: []
        }
        return new Bookmark(obj, false);
    }

    static newEmpty() {
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

    isFolder() {
        return this.children != null;
    }

    toHTMLString() {
        let attrString = "";
        for (const [key, value] of Object.entries(this.attributes)) {
            attrString += ` ${key.toUpperCase()}="${value}"`;
        }
        const escaped = escapeHTML(this.text);
        return `<${this.tag}${attrString}>${escaped}</${this.tag}>`;
    }

    // Visit every node once
    *walk() {
        const stack = [this];
        while(stack.length > 0) {
            const node = stack.pop();
            yield node;
            if (node.children) {
                stack.push(...node.children.toReversed());
            }
        }
    }

    /* Parse like HTML - visit nodes first on opening and again on closing.
     * Nodes that represent void tags are visited only once.
     */
    *traverse() {
        const stack = [new BookmarkFrame(this, 0)];
        while (stack.length > 0) {
            const top = stack.pop();
            yield top;
            if (top.visited == false) {
                top.visit();
                stack.push(top);
                stack.push(...top.fromChildren());
            }
        }
    }
}