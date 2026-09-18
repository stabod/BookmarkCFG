<script>
    import { getContext } from "svelte";
    import { SvelteSet } from "svelte/reactivity";
    import BookmarkList from "$lib/components/BookmarkList.svelte";
    import { NAME_ID, URL_ID, ADD_DATE_ID, LAST_MODIFIED_ID } from "$lib/bookmark.svelte";

    const fieldFilters = new SvelteSet([NAME_ID, URL_ID, ADD_DATE_ID, LAST_MODIFIED_ID]);

    const data = getContext("bookmarkData");
    let searchText = $state("")
    let searchArray = $derived.by(() => deriveSearchArray(fieldFilters));
    let found = $derived.by(() => search(searchText));

    function toggleFilter(filter) {
        fieldFilters.has(filter) ? fieldFilters.delete(filter) : fieldFilters.add(filter);
    }

    function deriveSearchArray(filters) {
        const arr = [];
        if (!data.bookmarkArray) return arr;
        for (const el of data.bookmarkArray) {
            arr.push(el.toSearchString(filters));
        }
        return arr;
    }
    
    function search(text) {
        const query = searchText.trim().toLowerCase();
        const arr = [];
        for (const [i, v] of searchArray.entries()) {
            if (v.match(query)) {
                arr.push(data.bookmarkArray[i]);
            }
        }
        return arr;
    }
</script>

<div class="search-holder">
    <div class="search-bar">
        <label for="search-box">Search</label>
        <input id="search-box" type="text" bind:value={searchText}/>
        <p>Found: {found.length}</p>
    </div>

    <div class="filter-buttons-holder">
        <button class={["filter-button", fieldFilters.has(NAME_ID) && "filter-button-pressed"]}
                onclick={() => toggleFilter(NAME_ID)}>
                {fieldFilters.has(NAME_ID) ? "Ignore Name" : "Search by Name" }
        </button>

        <button class={["filter-button", fieldFilters.has(URL_ID) && "filter-button-pressed"]}
                onclick={() => toggleFilter(URL_ID)}>
                {fieldFilters.has(URL_ID) ? "Ignore URL" : "Search by URL" }
        </button>

        <button class={["filter-button", fieldFilters.has(ADD_DATE_ID) && "filter-button-pressed"]}
                onclick={() => toggleFilter(ADD_DATE_ID)}>
                {fieldFilters.has(ADD_DATE_ID) ? "Ignore Add Date" : "Search by Add Date" }
        </button>

        <button class={["filter-button", fieldFilters.has(LAST_MODIFIED_ID) && "filter-button-pressed"]}
                onclick={() => toggleFilter(LAST_MODIFIED_ID)}>
                {fieldFilters.has(LAST_MODIFIED_ID) ? "Ignore Last Modified" : "Search by Last Modified" }
        </button>
    </div>

    <BookmarkList nodes={found}/>  
</div>

<style> 
    .search-holder {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .search-bar {
        margin: 8px;
        display: flex;
        justify-content: space-evenly;
        align-items: baseline;
    }

    .filter-buttons-holder {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: baseline;
        margin: 4px;
    }

    .filter-button {
        width: 100%;
        background-color: var(--accent-color-1);
        border: 4px solid var(--border-color);
        border-style: outset;
    }

    .filter-button-pressed {
        background-color: var(--accent-color-4);
        border-style: inset;
    }
</style>