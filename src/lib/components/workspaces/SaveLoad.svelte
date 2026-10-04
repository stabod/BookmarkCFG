<script>
    import { exportHTML, exportJSON, exportText } from "#lib/export-utils.js";
    import { getContext } from "svelte";

    const data = getContext("bookmarkData");
    const locale = getContext("locale");
</script>

<div class="save-load-holder">
    <button onclick={() => exportHTML(data.toHTML())}
        >{locale.ui?.save_load.export_html_button}</button
    >
    <button onclick={() => exportJSON(data.toJSON())}
        >{locale.ui?.save_load.export_json_button}</button
    >
    <button onclick={() => exportText(data.toText())}
        >{locale.ui?.save_load.export_txt_button}</button
    >
    <button onclick={() => data.clear()} class="warning"
        >{locale.ui?.save_load.unload_button}</button
    >
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
