<script>
    import { exportHTML } from "$lib/export-html";
    import { getContext } from "svelte";

    const data = getContext("bookmarkData");
</script>

<div class="save-load-holder">
    <button onclick={() => exportHTML(data.toHTML())}>Export to HTML</button>
    <button>Export to text TODO</button>
    <button>Export to JSON TODO</button>
    <button onclick={() => data.clear()} class="warning">Unload</button>
</div>

<style>
    .save-load-holder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    button {
        margin: 16px;
        width: 95%;
    }
</style>