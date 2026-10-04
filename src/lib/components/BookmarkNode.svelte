<script>
    import { getContext } from "svelte";
    import BookmarkNode from "./BookmarkNode.svelte";
    import bookmarkIcon from "#lib/assets/star.png";
    import folderIcon from "#lib/assets/folder.png";
    let { node } = $props();

    const selection = getContext("selection");
    const foldContext = getContext("folded");
    const folderOnly = getContext("folderOnly");

    const isFolded = $derived(foldContext?.has(node));

    function toggleFold() {
        if (isFolded) {
            foldContext.delete(node);
        } else {
            foldContext.add(node);
        }
    }

    function clickOnNode(event) {
        if (selection.isSelected(node)) {
            selection.unselect(node);
        } else if (event.shiftKey || selection.isMultiSelectMode()) {
            selection.selectAdd(node);
        } else {
            selection.select(node);
        }
    }
</script>

{#snippet recursive(parent)}
    <ul class="node-list">
        {#each folderOnly ? parent.children.filter( (x) => x.isFolder(), ) : parent.children as child}
            <li class="node-item">
                <BookmarkNode node={child} {folderOnly} />
            </li>
        {/each}
    </ul>
{/snippet}

<div draggable="true">
    <button
        class={selection.isSelected(node)
            ? "bookmark-btn selected"
            : "bookmark-btn"}
        onclick={(event) => clickOnNode(event)}
    >
        {#if node.isFolder()}
            <img alt="" src={folderIcon} class="bookmark-icon" />
        {/if}
        {#if !node.isFolder()}
            <img
                alt=""
                src={node.attributes.icon ? node.attributes.icon : bookmarkIcon}
                class="bookmark-icon"
            />
        {/if}
        {node.text}
    </button>
    {#if foldContext && node.isFolder()}
        <button class="fold-btn" onclick={toggleFold}>
            {isFolded ? "←" : "↓"}
        </button>
    {/if}
</div>

{#if !isFolded && node.children}
    {@render recursive(node)}
{/if}

<style>
    .node-list {
        list-style: none;
        border-left: 2px ridge;
    }

    .node-item {
        margin: 4px 0;
        padding: 2px 4px;
    }

    .bookmark-btn {
        background-color: var(--accent-color-1);
        color: var(--text-color);
        padding: 4px 4px;
        border-radius: 6px;
        border-style: outset;
        border-color: var(--border-color);
        cursor: pointer;
        font-size: 1em;
    }

    .selected {
        background-color: var(--accent-color-4);
        border-style: inset;
    }

    .fold-btn {
        padding: 4px 8px;
        font-weight: 400;
    }
</style>
