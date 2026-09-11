import { parseHTML, HTMLToObject, HTML_HEADER, ELEMENT_TAG, OPEN_CONTAINER_TAG, CLOSE_CONTAINER_TAG  } from "$lib/html-utills.js"
import { Bookmark } from "./bookmark.svelte";

export class BookmarkData {

    bookmarkTree = $state(null);
    bookmarkArray = null;
    parentMap = null;

    static HTMLToTree(text) {
        const parsed = parseHTML(text);
        const tree = HTMLToObject(parsed);
        return tree;
    }

    static deriveFromTree(tree, array, map) {
        const parentStack = [null];
        for (const el of tree.traverse()) {
            const parentNode = parentStack[0];
            if (el.visited != true) {
                array.push(el.node);
                map.set(el.node.id, parentNode);
            }
            if (el.visited == false) {
                parentStack.unshift(el.node);
            }
            if (el.visited == true) {
                parentStack.shift();
            }
        }
    }

    constructor(tree = null) {
        if (tree != null) {
            this.load(tree);
        }
    }

    loadHTML(text) {
        const tree = BookmarkData.HTMLToTree(text);
        this.load(tree);
    }

    load(tree) {
        this.bookmarkTree = tree;
        this.bookmarkArray = [];
        this.parentMap = new Map();
        BookmarkData.deriveFromTree(this.bookmarkTree, this.bookmarkArray, this.parentMap);
    }

    clear() {
        this.bookmarkTree = null;
        this.bookmarkArray = null;
        this.parentMap = null;
    }

    isLoaded() {
        return this.bookmarkTree != null;
    }

    getBookmarks() {
        if (!this.bookmarkTree) return null; 
        return this.bookmarkTree.children;
    }

    getParentOfNode(node) {
        return this.parentMap.get(node.id);
    }

    getSiblingsOfNode(node) {
        const parent = this.getParentOfNode(node);
        if (!parent) return null;
        return parent.children;
    }

    getIndexOfNode(node) {
        const parent = this.getParentOfNode(node);
        return parent.children.indexOf(node);
    }

    swap(node1, node2) {
        const array1 = this.getSiblingsOfNode(node1);
        const index1 = array1.indexOf(node1);
        const array2 = this.getSiblingsOfNode(node2);
        const index2 = array2.indexOf(node2);

        const tmp = array1[index1];
        array1[index1] = array2[index2];
        array2[index2] = tmp;
    }
    
    addNode(parent, toBeFolder) {
        const array = parent.children;
        const newNode = toBeFolder ? Bookmark.newFolder() : Bookmark.newBookmark();
        array.push(newNode);
        this.bookmarkArray.push(newNode);
        this.parentMap.set(newNode.id, array);
    }

    removeNode(node) {
        const nodeId = node.id;
        const parent = this.parentMap.get(nodeId);
        if (!parent) return;
        const siblings = parent.children;
        const index = siblings.indexOf(node);

        siblings.splice(index, 1);
        this.bookmarkArray[nodeId] = null;
        this.parentMap.delete(nodeId);
    }

    toHTML() {
        let text = "" + HTML_HEADER;
        for (const el of this.bookmarkTree.traverse()) {
            const indent = "    ".repeat(el.depth);
            let string = "" + indent;

            if (el.visited != true) {
                if (el.depth > 0) { string += ELEMENT_TAG; }
                string += indent + el.node.toHTMLString() + '\n';
                if (el.visited === false) { string += indet + OPEN_CONTAINER_TAG; }
            } else {
                string += indent + CLOSE_CONTAINER_TAG;
            }
            text += string;
        }
        return text;
    }


}