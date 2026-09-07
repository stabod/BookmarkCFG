import { Bookmark, HEADER_TAGS } from "./bookmark.svelte";

export const selectedBookmark = $state({
    bookmark: null,
    lineage: [],
    bookmarkElement: null,
    selectNew(bookmark, lineage, element) {
        this.bookmark = bookmark;
        this.lineage = lineage;
        this.bookmarkElement = element;
    },
    clear() {
        this.bookmark = null;
        this.lineage = [];
        this.bookmarkElement?.focus();
        this.bookmarkElement = null;
    },
    moveUp() {
        if (this.bookmark == null || this.lineage == null) return;

        const parent = this.lineage.at(-1);
        if (!parent) return;

        const siblings = parent?.children;
        if (!siblings || siblings.length == 1) return;

        const index = siblings.indexOf(this.bookmark);
        if (index == 0) return;

        const previous = index - 1;
        const tmp = siblings[index];
        siblings[index] = siblings[previous];
        siblings[previous] = tmp;
    },
    moveDown() {
        if (this.bookmark == null || this.lineage == null) return;

        const parent = this.lineage.at(-1);
        if (!parent) return;

        const siblings = parent?.children;
        if (!siblings || siblings.length == 1) return;

        const index = siblings.indexOf(this.bookmark);
        if (index == (siblings.length - 1)) return;

        const next = index + 1;
        const tmp = siblings[index];
        siblings[index] = siblings[next];
        siblings[next] = tmp;
    },
    newBookmark() {
        if (!HEADER_TAGS.has(this.bookmark.tag)) return;
        const book = Bookmark.createNewBookmark();
        this.bookmark.children.push(book);
        this.bookmark = book;
        this.lineage.push(book);
    }
})

