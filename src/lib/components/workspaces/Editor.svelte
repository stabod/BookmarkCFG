<script>
    import { getContext } from 'svelte';
    import { HEADER_TAGS } from '$lib/html-utils';
    import { timestampToLocalDate, dateToSecTimestamp } from '$lib/datetime-utils.js';
    const selection = getContext('selection');
    
</script>

{#snippet editFields()}
    <label class="label-text" for="bookmark-text-input">Text</label>
    <input id="bookmark-text-input" type="text" bind:value={selection.selected.text} />

    <div class="date-holder">
        <label class="label-text" for="bookmark-date-added-input">Date Added</label>
        <label class="label-text" for="bookmark-date-added-input-timestamp">Date Added Timestamp</label>

        <input id="bookmark-date-added-input" type="datetime-local" 
                bind:value={() => selection.selected.getAddDateLocalISOString(),
                            (v) => selection.selected.setAddDate(v)}/>
        <input id="bookmark-date-added-input-timestamp" type="number" bind:value={selection.selected.attributes.add_date}/>
    </div>

   <div class="date-holder">
        <label class="label-text" for="bookmark-last-modified-input">Last Modified</label>
        <label class="label-text" for="bookmark-last-modified-input-timestamp">Last Modified Timestamp</label>

        <input id="bookmark-last-modified-input" type="datetime-local" 
                bind:value={() => selection.selected.getLastModifiedLocalISOString(),
                            (v) => selection.selected.setLastModified(v)}/>
        <input id="bookmark-last-modified-input-timestamp" type="number" bind:value={selection.selected.attributes.last_modified}/>
    </div> 

    

    <label class="label-text" for="bookmark-URL-input">URL</label>
    <input id="bookmark-URL-input" type="text" bind:value={selection.selected.attributes.href} 
            disabled={selection.selected.tag === "H3" ? true : false}/>
{/snippet}

{#snippet modifyButtons()}
    <button onclick={() => selection.moveUp()}>Move Up</button> 
    <button onclick={() => selection.moveDown()}>Move Down</button>
    <button onclick={() => selection.clear()}>Unselect</button>
    {#if HEADER_TAGS.has(selection.selected.tag)}
        <button onclick={() => selection.newBookmark()}>New</button>
        <button onclick={() => selection.newFolder()}>New Folder</button>
    {/if}
{/snippet}

{#if selection.selected == null}
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