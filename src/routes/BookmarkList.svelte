<script>
    import bookmarkIcon from "$lib/assets/star.png";
    import folderIcon from "$lib/assets/folder.png";
    let { nodes } = $props();

    function limitText(text) {
        if (text.length > 99) {
            return text.slice(0, 99) + "..."
        } else {
            return text + " ".repeat(100 - text.length);
        }
    }
</script>

{#snippet nodeRow(node)}
    <tr class="node-holder">
    {#if node.isFolder()}
        <td>
            <img alt='' src={folderIcon} class="bookmark-icon"/>
            {node.text}
        </td>
    {/if}
    {#if !node.isFolder()}
        <td>
            <img alt='' src={node.attributes.icon ? node.attributes.icon : bookmarkIcon} class="bookmark-icon"/>
            <a href={node.attributes.href} title={node.attributes.href}>{node.text}</a>
        </td>
    {/if}
        <td>
            {node.attributes.add_date}
        </td>
        <td>
            {node.attributes.last_modified}
        </td>
    </tr>
{/snippet}

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Add Date</th>
            <th>Last Modified</th>
        </tr>
    </thead>
    <tbody>
        {#each nodes as node}
            {@render nodeRow(node)}
        {/each}
    </tbody>
</table>

<style>
    .node-holder {
        color: var(--text-color);
        background-color: var(--accent-color-2);
        border: 4px solid var(--border-color);
        border-width: 2px;
        border-radius: 0;
        border-style: outset;
        padding: 4px;
        margin: 4px
    }

    table {
      width: 100%;
      table-layout: fixed;
      border-collapse: separate;
    }

    thead {
        background-color: var(--accent-color-4);
        position: sticky;
        top: 0;
    }

    th, td {
      padding: 8px;
      border: 2px solid var(--border-color);

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @media (max-width: 768px) {
        thead, td {
            font-size: 0.75em;
            white-space: normal;
        }
    }
</style>