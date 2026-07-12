<script>
    let { selected = $bindable(null), lineage = $bindable([]), actions} = $props();

    function prettyLineage() {
        let string = ""
        for (let ansestor of lineage) {
            string += ansestor.title
            string += ' > '
        }
        string += selected.title
        return string
    }

    function parseTimestamp(timestamp) {
        const ms = Number(timestamp) / 1000;
        const date = new Date(ms);
        return date.toISOString();
    }
</script>

{#snippet commonFields()}
    <label>
        Title
        <br>
        <input type="text" bind:value={selected.title}/>
    </label>
    <br>
    <label>
        Date Added
        <br>
        <input type="number" bind:value={selected.dateAdded}/>
        Which is {parseTimestamp(selected.dateAdded)}
    </label>
    <br>
    <label>
        Date Modified
        <br>
        <input type="number" bind:value={selected.lastModified}/>
        Which is {parseTimestamp(selected.lastModified)}
    </label>
    <br>
{/snippet}

{#snippet bookmarkSpecific()}
    <label>
        URI
        <br>
        <input type="text" bind:value={selected.uri}/>
    </label>
    <br>
    <label>
        Icon URI
        <br>
        <input type="text" bind:value={selected.iconUri}/>
        <br>
        <img src={selected.iconUri} alt='' style='width: 32px; height: 32px'/>
    </label>
    <br>
{/snippet}

{#snippet modifyButtons()}
    <button onclick={actions.moveUp}>Move Up</button> 
    <button onclick={actions.moveDown}>Move Down</button>
{/snippet}

<div>
    {#if selected == null}
        <span>Nothing is selected</span>
    {:else if selected.root}
        <span>Cannot edit root nodes</span>
    {:else}
        <span>{prettyLineage()}</span>
        <br>
        {@render commonFields()}
        {#if selected.typeCode == 1}
            {@render bookmarkSpecific()}
        {/if}
        {@render modifyButtons()}
    {/if}
</div>

<style>
    button {
    background: #00b4d8;
    border: none;
    padding: 10px 18px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    color: #050505;
  }
</style>