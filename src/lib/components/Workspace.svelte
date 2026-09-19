<script>
    import { getContext } from 'svelte';
    import BookmarkNode from '$lib/components/BookmarkNode.svelte';
    import Editor from '$lib/components/workspaces/Editor.svelte';
    import Search from '$lib/components/workspaces/Search.svelte';
    import Stats from '$lib/components/workspaces/Stats.svelte';
    import SaveLoad from '$lib/components/workspaces/SaveLoad.svelte';

    const EDITOR_TAB_ID = 0;
    const SEARCH_TAB_ID = 1;
    const STATS_TAB_ID = 2;
    const SAVELOAD_TAB_ID = 3;

    let openTab = $state(EDITOR_TAB_ID);
    const bookmarkData = getContext('bookmarkData');
</script>

<div class="tab-button-holder">
    <button class={['tab-button', openTab==EDITOR_TAB_ID && "tab-selected" ]} onclick={() => openTab=0}>Editor</button>
    <button class={['tab-button', openTab==SEARCH_TAB_ID && "tab-selected" ]} onclick={() => openTab=1}>Search</button>
    <button class={['tab-button', openTab==STATS_TAB_ID && "tab-selected" ]} onclick={() => openTab=2}>Stats</button>
    <button class={['tab-button', openTab==SAVELOAD_TAB_ID && "tab-selected" ]} onclick={() => openTab=3}>Save/Load</button>
</div>
<div class="workspace">
    <section class="pane">
        {#if openTab == EDITOR_TAB_ID} 
            <Editor/>
        {:else if openTab == SEARCH_TAB_ID}
            <Search/>
        {:else if openTab == STATS_TAB_ID}
            <Stats/>
        {:else if openTab == SAVELOAD_TAB_ID}
            <SaveLoad/> 
        {/if}
    </section>
</div>

<style>
    .tab-button-holder {
        background-color: var(--surface-color);
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        margin: 0px;
    }
    .tab-button {
        background-color: var(--accent-color-1);
        border-radius: 0px;
        border-style: outset;
        width: 100%;
    }
    .tab-selected {
        background-color: var(--accent-color-4);
        border-style: inset;
    }
    .workspace {
        display: flex;
        flex: 1;
        flex-direction: row;
        overflow-y: hidden;
    }
    .pane {
        flex: 1 1 0;
        background: var(--surface-color);
        border: 4px solid var(--border-color);
        border-radius: 0px;
        padding: 16px;
        min-width: 0;
        overflow-y: scroll;
    }

    @media (max-width: 768px) {
        .workspace {
            flex-direction: column;
        }
    }
</style>