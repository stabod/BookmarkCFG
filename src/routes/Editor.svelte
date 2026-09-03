<script>
    import { selectedBookmark } from '$lib/selectedBookmark.svelte.js'

    function prettyLineage() {
        let string = ""
        for (let ansestor of selectedBookmark.lineage) {
            string += ansestor.text
            string += ' > '
        }
        string += selectedBookmark.bookmark.text
        return string
    }

    function parseTimestamp(timestamp) {
        const ms = Number(timestamp) / 1000;
        const date = new Date(ms);
        return date.toISOString();
    }
</script>

{#snippet editFields()}
    <label class="label-text" for="bookmark-text-input">Text</label>
    <input id="bookmark-text-input" type="text" bind:value={selectedBookmark.bookmark.text} />

    <label class="label-text" for="bookmark-date-added-input">Date Added</label>
    <input id="bookmark-date-added-input" type="number" bind:value={selectedBookmark.bookmark.attributes.add_date}/>

    <label class="label=text" for="bookmark-last-modified-input">Last Modified</label>
    <input id="bookmark-last-modified-input" type="number" bind:value={selectedBookmark.bookmark.attributes.last_modified} 
            disabled={selectedBookmark.bookmark.tag === "A" ? true : false}/>

    <label class="label-text" for="bookmark-URL-input">URL</label>
    <input id="bookmark-URL-input" type="text" bind:value={selectedBookmark.bookmark.attributes.href} 
            disabled={selectedBookmark.bookmark.tag === "H3" ? true : false}/>
{/snippet}

{#snippet modifyButtons()}
    <button onclick={() => selectedBookmark.moveUp()}>Move Up</button> 
    <button onclick={() => selectedBookmark.moveDown()}>Move Down</button>
    <button onclick={() => selectedBookmark.clear()}>Unselect</button>
{/snippet}

<section>
    <h2>Editor</h2>
    {#if selectedBookmark.bookmark == null}
        <p class="no-selection">No selection</p>
    {:else}
        {@render editFields()}
        <div>
            {@render modifyButtons()}
        </div>
    {/if}
</section>

<style>
    section {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin-top: 8px;
    }

    .label-text {
        font-size: large;
        box-sizing: border-box;
        margin: 4px;
    }

    .no-selection {
        align-items: center;
        text-align: center;
        font-size: larger;
        font-style: bold;
    }

    input[type="text"] {
        width: 90%;
        padding: 8px;
        border-radius: 8px;
        font-size: large;
        box-sizing: border-box;
    }
    
    input[type="number"] {
        width: 90%;
        padding: 8px;
        border-radius: 8px;
        font-size: large;
        box-sizing: border-box;
    }

    button {
        background-color: var(--highlightColor);
        border: none;
        padding: 10px 18px;
        margin: 3px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        color: #050505;
    }
</style>