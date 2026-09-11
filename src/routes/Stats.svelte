<script>
    import { getContext } from "svelte";
    import { BookmarkStats } from "$lib/bookmark-stats.svelte";

    const data = getContext('bookmarkData');
    const stats = new BookmarkStats(data.bookmarkArray);
</script>

<div>
    <p>Total bookmarks: {stats.total}</p>
    <p>Bookmarks: {stats.bookmarks}</p>
    <p>Folders: {stats.folders}</p>
    <p>Duplicates: {stats.duplicates}</p>
</div>