<script>
    import { exportHTML } from "$lib/export-html";
    import { getContext } from "svelte";

    const data = getContext("bookmarkData");
    const locale = getContext("locale");
</script>

<div class="save-load-holder">
    <button onclick={() => exportHTML(data.toHTML())}>{locale.ui?.save_load.export_html_button}</button>
    <button>{locale.ui?.save_load.export_json_button} TODO</button>
    <button>{locale.ui?.save_load.export_txt_button} TODO</button>
    <button onclick={() => data.clear()} class="warning">{locale.ui?.save_load.unload_button}</button>
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