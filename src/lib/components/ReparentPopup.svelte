<script>
    import { getContext, setContext } from "svelte";
    import BookmarkNode from "./BookmarkNode.svelte";
    import { Selection } from "#lib/selection.svelte";

    const data = getContext("bookmarkData");
    const selection = getContext("selection");
    const locale = getContext("locale");
    const secondarySelection = new Selection(data, true);

    setContext("selection", secondarySelection);
    setContext("folderOnly", true);
    let dialog;
    let isOpen = $state(false);

    $effect(() => {
        if (isOpen) {
            dialog?.showModal();
        } else {
            dialog?.close();
        }
    });

    function doReparent() {
        const target = secondarySelection.getSingle();
        if (target.id == 0) return;
        selection.reparent(target);
        isOpen = false;
    }

    function checkOpen() {
        if (!selection.hasSelection()) return;
        else isOpen = true;
    }
</script>

<button onclick={() => checkOpen()}>
    {locale.ui?.editor.change_parent_button}</button
>

<dialog
    bind:this={dialog}
    onclose={() => {
        isOpen = false;
    }}
>
    <div class="dialog-holder">
        <div>
            <p>{locale.ui?.editor.change_parent_title}</p>
            <BookmarkNode node={data.getBookmarks()} />
        </div>
        <div>
            <p>
                {locale.ui?.editor.change_parent_text}
                {selection.getNumberSelected()}
                {selection.getNumberSelected() > 1
                    ? locale.ui?.generic.bookmark_plural
                    : locale.ui?.generic.bookmark_singular}
            </p>
            <button onclick={() => doReparent()}
                >{locale.ui?.generic.confirm}</button
            >
            <button
                onclick={() => {
                    isOpen = false;
                }}>{locale.ui?.generic.close}</button
            >
        </div>
    </div>
</dialog>

<style>
    .dialog-holder {
        display: flex;
        flex-direction: row;
    }
</style>
