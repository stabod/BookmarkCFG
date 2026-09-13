export class BookmarkStats {

    #total
    #bookmarks 
    #folders 
    #duplicatesArray
    #duplicates

    constructor(data) {
        this.data = data.getBookmarkArray();
        this.#total = $derived(this.data.length);
        this.#bookmarks = $derived(this.data.filter((node) => !node.isFolder()).length ?? 0);
        this.#folders = $derived(this.data.filter((node) => node.isFolder()).length ?? 0);
        this.#duplicatesArray = $derived.by(() => this.#findUniques());
    }

    #findUniques() {
        if (this.data == null) { return 0; }
        const unique = new Map();
        const arr = [];
        for (const el of this.data) {
            if (el.isFolder()) { 
                continue; 
            }
            if (unique.has(el.attributes.href)) {
                arr.push(el);
            } else {
                unique.set(el.attributes.href, el);
            }
        }
        return [...arr];
    }

    get total() {
        return this.#total;
    }

    get bookmarks() {
        return this.#bookmarks
    }

    get folders() {
        return this.#folders;
    }

    get duplicatesArray() {
        return this.#duplicatesArray;
    }
}