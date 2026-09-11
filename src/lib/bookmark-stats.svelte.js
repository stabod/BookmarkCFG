export class BookmarkStats {

    data = $state(null)
    #total = $derived(this.data != null ? this.data.length : 0);
    #bookmarks = $derived(this.data != null ? this.data.filter((node) => !node.isFolder()).length : 0);
    #folders = $derived(this.data != null ? this.data.filter((node) => node.isFolder()).length : 0);

    #duplicatesArray = [];
    #duplicates = $derived(this.#findUniques());

    #findUniques() {
        if (this.data == null) { return 0; }
        const unique = new Map();
        this.#duplicatesArray = [];
        for (const el of this.data) {
            if (el.isFolder()) { 
                continue; 
            }
            if (unique.has(el.attributes.href)) {
                this.#duplicatesArray.push(el);
            } else {
                unique.set(el.attributes.href, el)
            }
        }
        return this.#duplicatesArray.length;
    }

    constructor(data) {
        this.data = data;
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

    get duplicates() {
        return this.#duplicates;
    }
}