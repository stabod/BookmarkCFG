<script>
    import BookmarkNode from "./BookmarkNode.svelte";
    import { selectedBookmark } from "$lib/selectedBookmark.svelte";
    let { node, lineage = [] } = $props();
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

<div class={selectedBookmark.bookmark === node ? "selected" : "regular"}>
        {#if node.text}
            <label>
            {#if node.tag === "H1"}📕{/if}
            {#if node.tag === "H3"}📁{/if}
            {#if node.tag === "A"}<img alt="bookmark icon" src={node.attributes.icon} class="bookmark-icon"/>{/if}
                <input
                    class="hide-radio"
                    type="radio"
                    checked={selectedBookmark.bookmark === node}
                    onchange={() => selectedBookmark.selectNew(node, lineage)}
                />
                {node.text}
            </label>
        {/if}
        {#if node.children}
            {@render recursive(node)}
        {/if}
</div>

<style>
    .node-list {
        list-style: none;
    }
    .node-item {
        margin: 4px 0;
        padding: 2px 4px;
        border-radius: 4px;
    }
    input[type="radio"]{
        visibility: hidden;
        height: 0;
        width: 0;
    } 
    .regular {
        word-wrap: normal;
        text-overflow: ellipsis;
    }
    .selected {
        word-wrap: normal;
        text-overflow: ellipsis;
        background-color: var(--highlightColor);
    }
</style>
