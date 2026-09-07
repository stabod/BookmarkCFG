<script>
    import { selectedBookmark } from '$lib/selectedBookmark.svelte.js'
    import { HEADER_TAGS } from '$lib/bookmark.svelte';

    const DATETIME_LOCAL_STR_LENGHT = 19;
    const MILLISECONDS = 1000;
    const MINUTES_IN_MILLISECONDS = 60 * MILLISECONDS;

    function prettyLineage() {
        let string = ""
        for (let ansestor of selectedBookmark.lineage) {
            string += ansestor.text
            string += ' > '
        }
        string += selectedBookmark.bookmark.text
        return string
    }

    function timestampToDate(timestamp) {
        if (!timestamp) {
            timestamp = '0';
        }
        const ms = Number(timestamp) * MILLISECONDS;
        const date = new Date(ms);

        const localMS = ms - (date.getTimezoneOffset() * MINUTES_IN_MILLISECONDS);
        const localDate = new Date(localMS);
        const str = localDate.toISOString();
        return str.slice(0, DATETIME_LOCAL_STR_LENGHT); /* Ignores milliseconds and Z */
    }

    function dateToTimestamp(dateStr) {
        const date = new Date(dateStr);
        const sec = date.getTime() / MILLISECONDS;
        const floored = Math.floor(sec);
        return floored;
    }
</script>

{#snippet editFields()}
    <label class="label-text" for="bookmark-text-input">Text</label>
    <input id="bookmark-text-input" type="text" bind:value={selectedBookmark.bookmark.text} />

    <div class="date-holder">
        <label class="label-text" for="bookmark-date-added-input">Date Added</label>
        <label class="label-text" for="bookmark-date-added-input-timestamp">Date Added Timestamp</label>

        <input id="bookmark-date-added-input" type="datetime-local" 
                bind:value={() => timestampToDate(selectedBookmark.bookmark.attributes.add_date),
                            (v) => selectedBookmark.bookmark.attributes.add_date = dateToTimestamp(v)}/>
        <input id="bookmark-date-added-input-timestamp" type="number" bind:value={selectedBookmark.bookmark.attributes.add_date}/>
    </div>

   <div class="date-holder">
        <label class="label-text" for="bookmark-last-modified-input">Last Modified</label>
        <label class="label-text" for="bookmark-last-modified-input-timestamp">Last Modified Timestamp</label>

        <input id="bookmark-last-modified-input" type="datetime-local" 
                bind:value={() => timestampToDate(selectedBookmark.bookmark.attributes.last_modified),
                            (v) => selectedBookmark.bookmark.attributes.last_modified = dateToTimestamp(v)}/>
        <input id="bookmark-last-modified-input-timestamp" type="number" bind:value={selectedBookmark.bookmark.attributes.last_modified}/>
    </div> 

    

    <label class="label-text" for="bookmark-URL-input">URL</label>
    <input id="bookmark-URL-input" type="text" bind:value={selectedBookmark.bookmark.attributes.href} 
            disabled={selectedBookmark.bookmark.tag === "H3" ? true : false}/>
{/snippet}

{#snippet modifyButtons()}
    <button onclick={() => selectedBookmark.moveUp()}>Move Up</button> 
    <button onclick={() => selectedBookmark.moveDown()}>Move Down</button>
    <button onclick={() => selectedBookmark.clear()}>Unselect</button>
    {#if HEADER_TAGS.has(selectedBookmark.bookmark.tag)}
        <button onclick={() => selectedBookmark.newBookmark()}>New</button>
    {/if}
{/snippet}

{#if selectedBookmark.bookmark == null}
    <p class="no-selection">No selection</p>
{:else}
    <div class="field-holder">
        {@render editFields()}
    </div>
    <div class="button-holder">
        {@render modifyButtons()}
    </div>
{/if}

<style>
    .field-holder {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 8px;
    }

    .date-holder {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        width: 90%;
        justify-content: center;
        align-items: center;
    }
    
    .button-holder {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: baseline;
        margin: 8px;
    }

    .label-text {
        font-size: 1em;
        box-sizing: border-box;
        margin: 8px;
    }

    .no-selection {
        align-items: center;
        text-align: center;
        font-size: larger;
        font-style: bold;
    }
    
</style>