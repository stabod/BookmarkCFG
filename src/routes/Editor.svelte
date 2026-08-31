<script>
    import { selection } from './selectedBookmark.svelte.js'

    function prettyLineage() {
        let string = ""
        for (let ansestor of selection.lineage) {
            string += ansestor.text
            string += ' > '
        }
        string += selection.bookmark.text
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
        <span class="label-text">Title</span>
        <br>
        <input type="text" bind:value={selection.bookmark.text}/>
    </label>
    <br>
    <label>
        <span class="label-text">Date Added</span>
        <br>
        <input type="number" bind:value={selection.bookmark.attributes.add_date}/>
    </label>
    <br>
    <label>
        <span class="label-text">Date Modified</span>
        <br>
        <input type="number" bind:value={selection.bookmark.attributes.last_modified}/>
    </label>
    <br>
{/snippet}

{#snippet bookmarkSpecific()}
    <label>
        <span class="label-text">URI</span>
        <br>
        <input type="text" bind:value={selection.bookmark.attributes.href}/>
    </label>
    <br>
{/snippet}

{#snippet modifyButtons()}
    <button onclick={() => selection.moveUp()}>Move Up</button> 
    <button onclick={() => selection.moveDown()}>Move Down</button>
    <button onclick={() => selection.clear()}>Unselect</button>
{/snippet}

<div>
    {#if selection.bookmark == null}
        <span>Nothing is selected</span>
    {:else}
        <br>
        <div class="fields">
            {@render commonFields()}
            {#if selection.bookmark.tag === "A"}
                {@render bookmarkSpecific()} 
            {/if}
        </div>
        <div class="modify-buttons">
            {@render modifyButtons()}
        </div>
        <span>{prettyLineage()}</span>
    {/if}
</div>

<style>
    label {
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
    background: #00b4d8;
    border: none;
    padding: 10px 18px;
    margin: 3px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    color: #050505;

    .modify-buttons {
        display: flex;
        flex-direction: row;
    }
  }
</style>