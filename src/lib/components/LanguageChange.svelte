<script>
    import { getContext } from "svelte";
    import i18nMapping from "#lib/i18n/lang-map.json";

    const locale = getContext("locale");

    let dialog;
    let isOpen = $state(false);

    $effect(() => {
        if (isOpen) {
            dialog?.showModal();
        } else {
            dialog?.close();
        }
    });
</script>

<button
    class="hidden-button"
    onclick={() => {
        isOpen = true;
    }}>{locale.ui?.top.language_button}</button
>

<dialog
    bind:this={dialog}
    onclose={() => {
        isOpen = false;
    }}
>
    <p>{locale.ui?.top.language_change_title}</p>
    <div class="dialog-holder">
        {#each Object.entries(i18nMapping) as key}
            <button
                onclick={() => {
                    locale.loadLang(key[0]);
                    isOpen = false;
                }}>{key[1]}</button
            >
        {/each}
    </div>
    <div>
        <button
            onclick={() => {
                isOpen = false;
            }}>{locale.ui?.generic.close}</button
        >
    </div>
</dialog>

<style>
    dialog {
        background-color: var(--surface-color);
        border: 4px outset var(--border-color);
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        margin: auto;
        max-width: 90vw;
        max-height: 90vh;
    }

    dialog::backdrop {
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(2px);
    }

    .dialog-holder {
        display: flex;
        flex-direction: column;
    }
</style>
