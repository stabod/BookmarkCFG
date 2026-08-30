<script>
    import BookmarkNode from "./BookmarkNode.svelte";
    import { selection } from './selectedBookmark.svelte.js';
    let { node, lineage = [] } = $props();

    function renameRoots(title) {
        switch(title) {
            case 'menu':
                return 'Bookmark Menu'
            case 'toolbar':
                return 'Bookmark Toolbar'
            case 'unfiled':
                return 'Unfiled Bookmarks'
            case 'mobile':
                return 'Mobile Bookmarks'
            default:
                return title;
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

<div class={selection.bookmark === node ? "selected" : "regular"}>
    <label class={node.root ? "topitem-text" : "folder-text"}>
        <input
            class="hide-radio"
            type="radio"
            checked={selection.bookmark === node}
            onchange={() => selection.selectNew(node, lineage)}
        />
        {#if node.root} 
            {renameRoots(node.title)}
        {:else}
            {node.title}
        {/if}
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
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: left;
        max-width: 320px;
    }
    .topitem-text {
        white-space: hidden;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: large;
        text-align: center;
        border: solid;
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
        overflow: hidden;
        background-color: #004b21;
    }
    .placeholder {
        font-size: large;
        text-align: center;
        opacity: 75%;
    }
</style>
