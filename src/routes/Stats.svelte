<script>
    import { getContext } from "svelte";
    import { BookmarkStats } from "$lib/bookmark-stats.svelte.js";
    import BookmarkListNode from "./BookmarkList.svelte";
    import BookmarkList from "./BookmarkList.svelte";

    const data = getContext('bookmarkData');
    const stats = new BookmarkStats(data);
</script>

<div>
    <p>Total bookmarks: {stats.total}</p>
    <p>Bookmarks: {stats.bookmarks}</p>
    <p>Folders: {stats.folders}</p>
    <p>Duplicates: {stats.duplicatesArray.length}</p>
    {#if stats.duplicatesArray.length > 0} 
        <BookmarkList nodes={stats.duplicatesArray}/>
    {:else} 
        <p>No duplicate bookmarks found.</p>
    {/if}
</div>