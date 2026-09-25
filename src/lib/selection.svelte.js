import { SvelteSet } from "svelte/reactivity";
import { Bookmark } from "./bookmark.svelte.js";

export class Selection {

    #selected = new SvelteSet();
    #multiSelectMode = $state(false);
    #data = null;

    constructor(data) {
        this.#data = data;
    }

    toggleMultiSelect() {
        this.#multiSelectMode = !this.#multiSelectMode;
        return this.#multiSelectMode;
    }

    hasSelection() {
        return (this.#data != null && this.#selected.size > 0);
    }

    getNumberSelected() {
        return this.#selected.size;
    }

    isMultiSelectMode() {
        return this.#multiSelectMode;
    }

    isSelected(node) {
        return this.#selected.has(node);
    }

    #mutliSelect(node) {
        if (this.#selected.has(node)) {
            this.#selected.delete(node)
        } else {
            this.#selected.add(node);
        }
    }

    selectAdd(node) {
        this.#selected.add(node);
    }

    select(node) {
        if (this.#multiSelectMode) {
            this.#mutliSelect(node); 
        } else {
            this.#selected.clear();
            this.#selected.add(node);
        }
    }

    getSingle() {
        if (!this.hasSelection() || this.#selected.size > 1) {
            return Bookmark.newEmpty();
        }
        return this.#selected.values().next().value; // I hate this. 
    }

    clear() {
        this.#selected.clear();
    }    

    moveUp() {
        if (!this.hasSelection()) return;
        for (const el of this.#selected) {
            const siblings = this.#data.getSiblingsOfNode(el);
            if (siblings.length == 1) continue;

            const index = siblings.indexOf(el);
            if (index == 0) continue;

            this.#data.swap(siblings[index], siblings[index-1]);
        }
    }

    moveDown() {
        if (!this.hasSelection()) return;
        for (const el of this.#selected) {
            const siblings = this.#data.getSiblingsOfNode(el);
            if (siblings.length == 1) continue;

            const index = siblings.indexOf(el);
            if (index == (siblings.length - 1)) continue;

            this.#data.swap(siblings[index], siblings[index+1]);
        }
    }

    newBookmark() {
        if (!this.hasSelection()) return;
        for (const el of this.#selected) {
            if (!el.isFolder()) continue;
            this.#data.addNode(el, false); 
        }
    }

    newFolder() {
        if (!this.hasSelection()) return;
        for (const el of this.#selected) {
            if(!el.isFolder()) continue;
            this.#data.addNode(el, true);
        }
    }

    touch() {
        if (!this.hasSelection()) return;
        for (const el of this.#selected) {
            el.touch();
        }
    }
    
    delete() {
        if (!this.hasSelection()) return;
        for (const el of this.#selected) {
            this.#data.removeNode(el);
        }
    }
}