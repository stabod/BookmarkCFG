<script>
    import { getContext, setContext } from "svelte";
    import { timestampToLocalDate, dateToSecTimestamp } from "$lib/datetime-utils.js";
    import BookmarkNode from "$lib/components/BookmarkNode.svelte";
    import ReparentPopup from "$lib/components/ReparentPopup.svelte";

    const data = getContext("bookmarkData");
    const selection = getContext("selection");
    const locale = getContext("locale");
    setContext('folderOnly', false);

    let singleSelection = $derived.by(() => selection.getSingle());
</script>

<div class="editor">
    <div class="tree-holder">
            <BookmarkNode node={data.getBookmarks()}/>
    </div>
    <div class="controls-holder">
        <div class={["field-holder", "blurred" && selection.getNumberSelected() != 1]}>
            <label class="label-text" for="bookmark-text-input">{locale.ui?.editor.title_label}</label>
            <input
                id="bookmark-text-input"
                type="text"
                bind:value={singleSelection.text}/>

            <div class="date-holder">
                <label class="label-text" for="bookmark-date-added-input"
                    >{locale.ui?.editor.date_added_label}</label>
                <label
                    class="label-text"
                    for="bookmark-date-added-input-timestamp"
                    >{locale.ui?.editor.date_added_timestamp_label}</label>

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
                    >{locale.ui?.editor.last_modified_label}</label>
                <label
                    class="label-text"
                    for="bookmark-last-modified-input-timestamp"
                    >{locale.ui?.editor.last_modified_timestamp_label}</label>

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

            <label class="label-text" for="bookmark-URL-input">{locale.ui?.editor.url_label}</label>
            <input
                id="bookmark-URL-input"
                type="text"
                bind:value={singleSelection.attributes.href}
                disabled={singleSelection?.isFolder()}
            />
            {#if selection.getNumberSelected() == 0}
                <div class="block">
                    <p>{locale.ui?.editor.no_selection_text}</p>
                </div>
            {:else if selection.getNumberSelected() > 1}
                <div class="block">
                    <p>{locale.ui?.editor.multi_select_block_text} {selection.getNumberSelected()} {locale.ui?.generic.bookmark_plural}</p>
                </div>
            {/if}
        </div>
        
        <div class="button-holder">
            <ReparentPopup/>
            <button onclick={() => selection.moveUp()}>{locale.ui?.editor.move_up_button}</button>
            <button onclick={() => selection.moveDown()}>{locale.ui?.editor.move_down_button}</button>
            <button onclick={() => selection.touch()}>{locale.ui?.editor.touch_button}</button>
            <button onclick={() => selection.clear()}>{locale.ui?.editor.deselect_button}</button>
            <button onclick={() => selection.newBookmark()}>{locale.ui?.editor.new_bookmark_button}</button>
            <button onclick={() => selection.newFolder()}>{locale.ui?.editor.new_folder_button}</button>
            <button class="warning" onclick={() => selection.delete()}>{locale.ui?.editor.delete_button}</button>
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
