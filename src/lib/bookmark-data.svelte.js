import {
    parseHTML,
    HTMLToObject,
    HTML_HEADER,
    ELEMENT_TAG,
    OPEN_CONTAINER_TAG,
    CLOSE_CONTAINER_TAG,
} from "$lib/html-utils.js";
import { Bookmark } from "./bookmark.svelte";

export class BookmarkData {
    bookmarkTree = $state(null);
    bookmarkArray = $state([]);
    parentMap = new Map();

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

    constructor() {}

    loadHTML(text) {
        const tree = BookmarkData.HTMLToTree(text);
        this.bookmarkTree = tree;
        BookmarkData.deriveFromTree(
            this.bookmarkTree,
            this.bookmarkArray,
            this.parentMap,
        );
    }

    newTree() {
        const tree = Bookmark.newRoot();
        this.bookmarkTree = tree;
        BookmarkData.deriveFromTree(
            this.bookmarkTree,
            this.bookmarkArray,
            this.parentMap,
        );
    }

    clear() {
        this.bookmarkTree = null;
        this.bookmarkArray = [];
        this.parentMap = new Map();
    }

    isLoaded() {
        return this.bookmarkTree != null;
    }

    getBookmarks() {
        if (!this.bookmarkTree) return null;
        return this.bookmarkTree;
    }

    getBookmarkArray() {
        if (!this.bookmarkTree) return null;
        return this.bookmarkArray;
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

    reparent(node, newParent) {
        if (node === newParent) return;

        const currentParent = this.getParentOfNode(node);
        if (!currentParent) return;
        if (currentParent === newParent) return;
        const currentArray = currentParent.children;

        const parentChildren = newParent.children;
        if (!parentChildren) return;

        const currentIndex = currentArray.indexOf(node);
        currentArray.splice(currentIndex, 1);
        parentChildren.push(node);
        this.parentMap.set(node.id, newParent);
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
        const newNode = toBeFolder
            ? Bookmark.newFolder()
            : Bookmark.newBookmark();
        array.push(newNode);
        this.bookmarkArray.push(newNode);
        this.parentMap.set(newNode.id, array);
    }

    removeNode(node) {
        const nodeId = node.id;
        const parent = this.parentMap.get(nodeId);
        if (!parent) return;
        const siblings = parent.children;
        const siblingIndex = siblings.indexOf(node);
        const arrayIndex = this.bookmarkArray.indexOf(node);

        siblings.splice(siblingIndex, 1);
        this.bookmarkArray.splice(arrayIndex, 1);
        this.parentMap.delete(nodeId);
    }

    toHTML() {
        let text = "" + HTML_HEADER;
        for (const el of this.bookmarkTree.traverse()) {
            const indent = "    ".repeat(el.depth);
            let string = "" + indent;

            if (el.visited != true) {
                if (el.depth > 0) {
                    string += ELEMENT_TAG;
                }
                string += el.node.toHTML() + "\n";
                if (el.visited == false) {
                    string += indent + OPEN_CONTAINER_TAG;
                }
            } else {
                string += indent + CLOSE_CONTAINER_TAG;
            }
            text += string;
        }
        return text;
    }
}
