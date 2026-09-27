<script>
    import { getContext, setContext } from "svelte";
    import { timestampToLocalDate, dateToSecTimestamp } from "$lib/datetime-utils.js";
    import BookmarkNode from "$lib/components/BookmarkNode.svelte";
    import ReparentPopup from "../ReparentPopup.svelte";

    const data = getContext("bookmarkData");
    const selection = getContext("selection");
    setContext('folderOnly', false);

    let singleSelection = $derived.by(() => selection.getSingle());
</script>

<div class="editor">
    <div class="tree-holder">
            <BookmarkNode node={data.getBookmarks()}/>
            <br/>
    </div>
    <div class="controls-holder">
        <div class={["field-holder", "blurred" && selection.getNumberSelected() != 1]}>
            <label class="label-text" for="bookmark-text-input">Text</label>
            <input
                id="bookmark-text-input"
                type="text"
                bind:value={singleSelection.text}/>

            <div class="date-holder">
                <label class="label-text" for="bookmark-date-added-input"
                    >Date Added</label>
                <label
                    class="label-text"
                    for="bookmark-date-added-input-timestamp"
                    >Date Added Timestamp</label>

                <input
                    id="bookmark-date-added-input"
                    type="datetime-local"
                    bind:value={
                        () => singleSelection?.getAddDateLocalISOString(),
                        (v) => singleSelection?.setAddDate(v)
                    }
                />
                <input
                    id="bookmark-date-added-input-timestamp"
                    type="number"
                    bind:value={singleSelection.attributes.add_date}
                />
            </div>

            <div class="date-holder">
                <label class="label-text" for="bookmark-last-modified-input"
                    >Last Modified</label>
                <label
                    class="label-text"
                    for="bookmark-last-modified-input-timestamp"
                    >Last Modified Timestamp</label>

                <input
                    id="bookmark-last-modified-input"
                    type="datetime-local"
                    bind:value={
                        () =>
                            singleSelection?.getLastModifiedLocalISOString(),
                        (v) => singleSelection?.setLastModified(v)
                    }
                />
                <input
                    id="bookmark-last-modified-input-timestamp"
                    type="number"
                    bind:value={singleSelection.attributes.last_modified}
                />
            </div>

            <label class="label-text" for="bookmark-URL-input">URL</label>
            <input
                id="bookmark-URL-input"
                type="text"
                bind:value={singleSelection.attributes.href}
                disabled={singleSelection?.isFolder()}
            />
            {#if selection.getNumberSelected() == 0}
                <div class="block">
                    <p>No selection.</p>
                </div>
            {:else if selection.getNumberSelected() > 1}
                <div class="block">
                    <p>Unavailable during multi-select.</p>
                    <br>
                    <p>Currently selected {selection.getNumberSelected()} nodes.</p>
                </div>
            {/if}
        </div>
        
        <div class="button-holder">
            <ReparentPopup/>
            <button onclick={() => selection.moveUp()}>Move Up</button>
            <button onclick={() => selection.moveDown()}>Move Down</button>
            <button onclick={() => selection.touch()}>Touch</button>
            <button onclick={() => selection.clear()}>Unselect</button>
            <button onclick={() => selection.newBookmark()}>New Bookmark</button>
            <button onclick={() => selection.newFolder()}>New Folder</button>
            <button class="warning" onclick={() => selection.delete()}>Delete</button>
        </div>
    </div>
</div>

<style>
    .editor {
        height: 100%;
        display: flex;
        flex-direction: row;
    }

    .tree-holder {
        width: 50%;
        overflow-y: scroll;
    }

    .controls-holder {
        width: 50%;
        overflow-y: hidden;
    }

    .field-holder {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 32px;
    }

    .blurred {
        filter: blur(16px);
        opacity: 0.4;
        pointer-events: none;
        user-select: none;
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
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        justify-content: space-evenly;
        align-items: baseline;
        margin: 8px;
    }

    .label-text {
        font-size: 1em;
        box-sizing: border-box;
        margin: 8px;
    }

    .block {
        position: absolute;
        height: 100%;
        width: 100%;
        background: var(--cover-color);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        align-items: center;
    }
</style>
