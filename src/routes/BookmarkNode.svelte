<script>
    import BookmarkNode from "./BookmarkNode.svelte";
    import { selection } from './selectedBookmark.svelte.js';
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

<div>
    <label class={node.root ? "topitem-text hide-radio" : "folder-text hide-radio"}>
        <input
            type="radio"
            checked={selection.bookmark === node}
            onchange={() => selection.selectNew(node, lineage)}
        />
        {node.title}
    </label>
    {#if node.typeCode == 2}
        {#if node.children}
            {@render recursive(node)}
        {:else}
            <span class="placeholder"> Empty </span>
        {/if}
    {/if}
</div>

<style>
    .node-list {
        list-style: none;
        padding-left: 18px;
        border-left: 1px dotted #444;
        margin: 6px 0;
    }
    .node-item {
        margin: 4px 0;
        padding: 2px 4px;
        border-radius: 4px;
    }
    .folder-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: left;
        max-width: 320px;
    }
    .topitem-text {
        white-space: nowrap;
        overflow: hidden;
        font-size: large;
        text-align: center;
        border: solid;
    }
    input[type="radio"]{
        visibility: hidden;
        height: 0;
        width: 0;
    } 
    input[type="radio"]:checked{
        background-color: #58ba83;
    }
    .placeholder {
        font-size: large;
        text-align: center;
        opacity: 75%;
    }
</style>
