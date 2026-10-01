<script>
    import { getContext } from "svelte";
    import { SvelteSet } from "svelte/reactivity";
    import bookmarkIcon from "$lib/assets/star.png";
    import folderIcon from "$lib/assets/folder.png";
    import {
        NAME_ID,
        URL_ID,
        ADD_DATE_ID,
        LAST_MODIFIED_ID,
    } from "$lib/bookmark.svelte";
    let { nodes } = $props();

    const showRows = new SvelteSet([
        NAME_ID,
        URL_ID,
        ADD_DATE_ID,
        LAST_MODIFIED_ID,
    ]);
    const locale = getContext("locale");

    function toggleVisibility(id) {
        showRows.has(id) ? showRows.delete(id) : showRows.add(id);
    }
</script>

{#snippet nodeRow(node)}
    <tr class="node-holder">
        {#if showRows.has(NAME_ID)}
            <td>
                {#if node.isFolder()}
                    <img class="bookmark-icon" alt="" src={folderIcon} />
                {:else}
                    <img
                        class="bookmark-icon"
                        alt=""
                        src={node.attributes.icon
                            ? node.attributes.icon
                            : bookmarkIcon}
                    />
                {/if}
                {node.text}
            </td>
        {/if}
        {#if showRows.has(URL_ID)}
            <td>
                {#if node.isFolder()}
                    N/A
                {:else}
                    <a href={node.attributes.href}>{node.attributes.href}</a>
                {/if}
            </td>
        {/if}
        {#if showRows.has(ADD_DATE_ID)}
            <td>
                {node.getAddDateLocalString()}
            </td>
        {/if}
        {#if showRows.has(LAST_MODIFIED_ID)}
            <td>
                {node.getLastModifiedLocalString()}
            </td>
        {/if}
    </tr>
{/snippet}

<div class="visibility-buttons-holder">
    <button
        class={["visibility-button", showRows.has(NAME_ID) && "visible-row"]}
        onclick={() => toggleVisibility(NAME_ID)}
    >
        {showRows.has(NAME_ID)
            ? locale.ui?.list.hide_name_button
            : locale.ui?.list.show_name_button}
    </button>

    <button
        class={["visibility-button", showRows.has(URL_ID) && "visible-row"]}
        onclick={() => toggleVisibility(URL_ID)}
    >
        {showRows.has(URL_ID)
            ? locale.ui?.list.hide_url_button
            : locale.ui.list.show_url_button}
    </button>

    <button
        class={[
            "visibility-button",
            showRows.has(ADD_DATE_ID) && "visible-row",
        ]}
        onclick={() => toggleVisibility(ADD_DATE_ID)}
    >
        {showRows.has(ADD_DATE_ID)
            ? locale.ui?.list.hide_add_date_button
            : locale.ui?.list.show_add_date_button}
    </button>

    <button
        class={[
            "visibility-button",
            showRows.has(LAST_MODIFIED_ID) && "visible-row",
        ]}
        onclick={() => toggleVisibility(LAST_MODIFIED_ID)}
    >
        {showRows.has(LAST_MODIFIED_ID)
            ? locale.ui?.list.hide_last_modified_button
            : locale.ui?.list.show_last_modified_button}
    </button>
</div>

<div class="table-holder">
    {#if showRows.size == 0}
        <p>{locale.ui?.list.all_hidden}</p>
    {/if}
    <table>
        <thead>
            <tr>
                {#if showRows.has(NAME_ID)}<th
                        >{locale.ui?.list.name_column_title}</th
                    >{/if}
                {#if showRows.has(URL_ID)}<th
                        >{locale.ui?.list.url_column_title}</th
                    >{/if}
                {#if showRows.has(ADD_DATE_ID)}<th
                        >{locale.ui?.list.add_date_column_title}</th
                    >{/if}
                {#if showRows.has(LAST_MODIFIED_ID)}<th
                        >{locale.ui?.list.last_modified_column_title}</th
                    >{/if}
            </tr>
        </thead>
        <tbody>
            {#each nodes as node}
                {@render nodeRow(node)}
            {/each}
        </tbody>
    </table>
</div>

<style>
    .table-holder {
        border: 4px solid var(--border-color);
        padding: 4px;
        border-style: outset;
        overflow-y: scroll;
    }

    .node-holder {
        color: var(--text-color);
        background-color: var(--accent-color-1);
        border: 4px solid var(--border-color);
        border-width: 2px;
        border-radius: 0;
        border-style: outset;
        padding: 4px;
        margin: 4px;
    }

    .visibility-buttons-holder {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: baseline;
        margin: 4px;
    }

    .visibility-button {
        width: 100%;
        background-color: var(--accent-color-1);
        border: 4px solid var(--border-color);
        border-style: inset;
    }

    .visible-row {
        background-color: var(--accent-color-4);
        border-style: outset;
    }

    table {
        width: 100%;
        table-layout: fixed;
        border-collapse: separate;
    }

    thead {
        background-color: var(--accent-color-3);
        position: sticky;
        top: 0;
    }

    th,
    td {
        padding: 8px;
        border: 2px solid var(--border-color);

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    @media (max-width: 768px) {
        thead,
        td {
            font-size: 0.75em;
            white-space: normal;
        }
    }
</style>
