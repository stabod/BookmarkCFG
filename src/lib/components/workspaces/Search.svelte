<script>
    import { getContext } from "svelte";
    import BookmarkList from "$lib/components/BookmarkList.svelte";
    import { BookmarkSearch } from "$lib/bookmark-search.svelte";
    import { NAME_ID, URL_ID, ADD_DATE_ID, LAST_MODIFIED_ID } from "$lib/bookmark.svelte";

    const data = getContext("bookmarkData");
    const locale = getContext("locale");
    const search = new BookmarkSearch(data); 
</script>

<div class="search-holder">
    <div class="search-bar">
        <label for="search-box">{locale.ui?.search.search_label}</label>
        <input id="search-box" type="text" bind:value={search.searchText}/>
        <p>{locale.ui?.search.found_text} {search.getTotalFound()}</p>
    </div>

    <div class="filter-buttons-holder">
        <button class={["filter-button", search.hasFilter(NAME_ID) && "filter-button-pressed"]}
                onclick={() => search.toggleFilter(NAME_ID)}>
                {search.hasFilter(NAME_ID) ? locale.ui?.search.ignore_name_button :  locale.ui?.search.search_by_name_button }
        </button>

        <button class={["filter-button", search.hasFilter(URL_ID) && "filter-button-pressed"]}
                onclick={() => search.toggleFilter(URL_ID)}>
                {search.hasFilter(URL_ID) ? locale.ui?.search.ignore_url_button :  locale.ui?.search.search_by_url_button }
        </button>

        <button class={["filter-button", search.hasFilter(ADD_DATE_ID) && "filter-button-pressed"]}
                onclick={() => search.toggleFilter(ADD_DATE_ID)}>
                {search.hasFilter(ADD_DATE_ID) ? locale.ui?.search.ignore_add_date_button :  locale.ui?.search.search_by_add_date_button }
        </button>

        <button class={["filter-button", search.hasFilter(LAST_MODIFIED_ID) && "filter-button-pressed"]}
                onclick={() => search.toggleFilter(LAST_MODIFIED_ID)}>
                {search.hasFilter(LAST_MODIFIED_ID) ? locale.ui?.search.ignore_last_modified_button :  locale.ui?.search.search_by_last_modified_button }
        </button>
    </div>

    <BookmarkList nodes={search.foundArray}/>  
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
        border-style: inset;
    }

    .filter-button-pressed {
        background-color: var(--accent-color-4);
        border-style: outset;
    }
</style>