import { HEADER_TAGS } from "./html-utils.js";
import { Bookmark } from "./bookmark.svelte.js";

export class Selection {

    selected = $state(null);
    selectedElement = null;
    data = null;

    constructor(data) {
        this.data = data;
    }

    select(node) {
        this.selected = node;
    }

    clear() {
        this.selected = null;
    }

    isSelected(node) {
        return this.selected === node;
    }

    moveUp() {
        if (this.selected == null || this.data == null) return;
        
        const siblings = this.data.getSiblingsOfNode(this.selected);
        if (siblings.length == 1) return;

        const index = siblings.indexOf(this.selected);
        if (index == 0) return;

        this.data.swap(siblings[index], siblings[index-1]);
    }

    moveDown() {
        if (this.selected == null || this.data == null) return;
        
        const siblings = this.data.getSiblingsOfNode(this.selected);
        if (siblings.length == 1) return;

        const index = siblings.indexOf(this.selected);
        if (index == (siblings.length - 1)) return;

        this.data.swap(siblings[index], siblings[index+1]);
    }

    newBookmark() {
        if (this.selected == null || this.data == null) return;
        if (!this.selected.isFolder()) return;
        this.data.addNode(this.selected, false); 
    }

    newFolder() {
        if (this.selected == null || this.data == null) return;
        if(!this.selected.isFolder()) return;
        this.data.addNode(this.selected, true);
    }



}