<script>
    import { getContext } from "svelte";
    import { BookmarkStats } from "#lib/bookmark-stats.svelte.js";
    import BookmarkListNode from "#lib/components/BookmarkList.svelte";
    import BookmarkList from "#lib/components/BookmarkList.svelte";

    const data = getContext("bookmarkData");
    const locale = getContext("locale");
    const stats = new BookmarkStats(data);
</script>

<div>
    <p>{locale.ui?.stats.total_label} {stats.total}</p>
    <p>{locale.ui?.stats.bookmarks_label} {stats.bookmarks}</p>
    <p>{locale.ui?.stats.folders_label} {stats.folders}</p>
    <p>{locale.ui?.stats.duplicates_label} {stats.duplicatesArray.length}</p>
    {#if stats.duplicatesArray.length > 0}
        <BookmarkList nodes={stats.duplicatesArray} />
    {:else}
        <p>{locale.ui?.stats.no_duplicates_text}</p>
    {/if}
</div>
