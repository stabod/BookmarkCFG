import { SvelteSet } from "svelte/reactivity";
import {
    NAME_ID,
    URL_ID,
    ADD_DATE_ID,
    LAST_MODIFIED_ID,
} from "./bookmark.svelte";

export class BookmarkSearch {
    #data;
    searchText;
    #fieldFilters;
    #searchArray;
    foundArray;

    constructor(data) {
        this.#data = $derived.by(() => data.getBookmarkArray());
        this.searchText = $state("");
        this.#fieldFilters = new SvelteSet([
            NAME_ID,
            URL_ID,
            ADD_DATE_ID,
            LAST_MODIFIED_ID,
        ]);
        this.foundArray = $derived.by(() => this.search());
    }

    toggleFilter(filter) {
        this.#fieldFilters.has(filter)
            ? this.#fieldFilters.delete(filter)
            : this.#fieldFilters.add(filter);
    }

    hasFilter(filter) {
        return this.#fieldFilters.has(filter);
    }

    getTotalFound() {
        return this.foundArray.length;
    }

    search() {
        const query = this.searchText.toLowerCase();
        const arr = [];
        for (const el of this.#data) {
            if (el.toSearchString(this.#fieldFilters).match(query)) {
                arr.push(el);
            }
        }
        return arr;
    }
}
