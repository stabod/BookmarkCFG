<script>
    import { getContext } from 'svelte';
    import BookmarkNode from "./BookmarkNode.svelte";
    import { selectedBookmark } from "$lib/selectedBookmark.svelte";
    let { node, lineage = [] } = $props();
    const foldContext = getContext('folded');
    const isFolded = $derived(foldContext?.has(node));

    function toggleFold() {
        if (isFolded) {
            foldContext.delete(node);
        } else {
            foldContext.add(node);
        }
    }
</script>

{#snippet recursive(parent)}
    <ul class="node-list">
        {#each parent.children as child}
            <li class="node-item">
                <BookmarkNode
                    node={child}
                    lineage={[...lineage, parent]}
                />
            </li>
        {/each}
    </ul>
{/snippet}

<div draggable="true">
    <button class={selectedBookmark.bookmark === node ? "bookmark-btn selected" : "bookmark-btn"}
            onclick={() => selectedBookmark.selectNew(node, lineage, this)}>
        {#if node.tag === "H3"}
            <img alt='' src="src/lib/assets/folder.png" class="bookmark-icon"/>
        {/if}
        {#if node.tag === "A"}
            <img alt='' src={node.attributes.icon ? node.attributes.icon : "/src/lib/assets/star.png"} class="bookmark-icon"/>
        {/if}
        {node.text}
    </button>
    {#if foldContext && node.tag === "H3"}
        <button class="fold-btn"
                onclick={toggleFold}>
            {isFolded ? 'Unfold' : 'Fold'}
        </button>
    {/if}
</div>


{#if !isFolded && node.children}
    {@render recursive(node)}
{/if}


<style>
    .node-list {
        list-style: none;
        border-radius: 4px;
        border-left: 2px groove;
    }

    .node-item {
        margin: 4px 0;
        padding: 2px 4px;
        
    }

    .bookmark-icon {
        height: 16px;
        width: 16px;
    }

    .bookmark-btn {
        background-color: var(--accent-color-1);
        color: var(--text-color);
        padding: 4px 8px;
        border-radius: 6px;
        border-style:outset;
        border-color: var(--border-color);
        cursor: pointer;
        font-size: 1em;
    }

    .selected {
        background-color: var(--accent-color-4);
    }

    .fold-btn {
        padding: 4px 8px;
        font-weight: 400;
    }
</style>
