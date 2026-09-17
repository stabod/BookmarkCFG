<script>
    import { getContext } from 'svelte';
    import BookmarkNode from './BookmarkNode.svelte';
    import Editor from './Editor.svelte';
    import Search from './Search.svelte';
    import Stats from './Stats.svelte';
    import SaveLoad from './SaveLoad.svelte';
    let openTab = $state(0);
    const bookmarkData = getContext('bookmarkData');
</script>

{#snippet tabButtons()}
    <button class={['tab-button', openTab===0 && "tab-selected" ]} onclick={() => openTab=0}>Editor</button>
    <button class={['tab-button', openTab===1 && "tab-selected" ]} onclick={() => openTab=1}>Search</button>
    <button class={['tab-button', openTab===2 && "tab-selected" ]} onclick={() => openTab=2}>Stats</button>
    <button class={['tab-button', openTab===3 && "tab-selected" ]} onclick={() => openTab=3}>Save/Load</button>
{/snippet}

{#snippet editorTab()}
    <section class="pane">
        <h2>Bookmark Tree</h2>
        {#each bookmarkData.getBookmarks() as child}
            <BookmarkNode node={child} />
        {/each}
    </section>
    <section class="pane">
        <h2>Editor</h2>
        <Editor/>
    </section>
{/snippet}

{#snippet searchTab()}
    <section class="pane">
        <Search/>
    </section>
{/snippet}

{#snippet statTab()}    
    <section class="pane">
       <Stats/> 
    </section>
{/snippet}

{#snippet saveLoadTab()}
    <section class="pane">
        <SaveLoad/>
    </section>
{/snippet}

<div class="tab-button-holder">
    {@render tabButtons()}
</div>
<div class="workspace">
    {#if openTab === 0} 
        {@render editorTab()}
    {:else if openTab === 1}
        {@render searchTab()}
    {:else if openTab === 2}
        {@render statTab()}
    {:else if openTab === 3}
        {@render saveLoadTab()}
    {/if}
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