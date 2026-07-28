<script>
    import { selection } from './selectedBookmark.svelte.js'

    function prettyLineage() {
        let string = ""
        for (let ansestor of selection.lineage) {
            string += ansestor.title
            string += ' > '
        }
        string += selection.bookmark.title
        return string
    }

    function parseTimestamp(timestamp) {
        const ms = Number(timestamp) / 1000;
        const date = new Date(ms);
        return date.toISOString();
    }
</script>

{#snippet commonFields()}
    <label>
        Title
        <br>
        <input type="text" bind:value={selection.bookmark.title}/>
    </label>
    <br>
    <label>
        Date Added
        <br>
        <input type="number" bind:value={selection.bookmark.dateAdded}/>
        Which is {parseTimestamp(selection.bookmark.dateAdded)}
    </label>
    <br>
    <label>
        Date Modified
        <br>
        <input type="number" bind:value={selection.bookmark.lastModified}/>
        Which is {parseTimestamp(selection.bookmark.lastModified)}
    </label>
    <br>
{/snippet}

{#snippet bookmarkSpecific()}
    <label>
        URI
        <br>
        <input type="text" bind:value={selection.bookmark.uri}/>
    </label>
    <br>
    <label>
        Icon URI
        <br>
        <input type="text" bind:value={selection.bookmark.iconUri}/>
        <br>
        <img src={selection.bookmark.iconUri} alt='' style='width: 32px; height: 32px'/>
    </label>
    <br>
{/snippet}

{#snippet modifyButtons()}
    <button onclick={() => selection.moveUp()}>Move Up</button> 
    <button onclick={() => selection.moveDown()}>Move Down</button>
{/snippet}

<div>
    {#if selection.bookmark == null}
        <span>Nothing is selection.bookmark</span>
    {:else if selection.bookmark.root}
        <span>Cannot edit root nodes</span>
    {:else}
        <span>{prettyLineage()}</span>
        <br>
        {@render commonFields()}
        {#if selection.bookmark.typeCode == 1}
            {@render bookmarkSpecific()}
        {/if}
        {@render modifyButtons()}
    {/if}
</div>

<style>
    button {
    background: #00b4d8;
    border: none;
    padding: 10px 18px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    color: #050505;
  }
</style>