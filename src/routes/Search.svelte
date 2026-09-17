<script>
    import { getContext } from "svelte";
    import BookmarkList from "./BookmarkList.svelte";

    const data = getContext("bookmarkData");
    let searchText = $state("")
    let found = $derived.by(() => search(searchText));
    
    function search(text) {
        if (!data.bookmarkArray) return [];
        const arr = [];
        for (const el of data.bookmarkArray) {
            if (el.toSearchString().match(text.toLowerCase())) {
                arr.push(el);
            }
        }
        return [...arr];
    }
</script>

<div class="search-holder">
    <div class="search-bar">
        <label for="search-box">Search</label>
        <input id="search-box" type="text" bind:value={searchText}/>
    </div>

    <p>Found: {found.length}</p>
    <BookmarkList nodes={found}/>  
</div>

<style> 
    .search-holder {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .search-bar {
        font-size: 1em;
        margin: 16px;
        display: flex;
        justify-content: space-between;
        align-items: baseline;
    }
</style>