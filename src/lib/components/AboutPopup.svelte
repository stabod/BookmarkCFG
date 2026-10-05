<script>
    import { getContext } from "svelte";
    let dialog;
    let isOpen = $state(false);
    const locale = getContext("locale");

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
    }}
>
    {locale.ui?.about.about_button}</button
>
<dialog
    bind:this={dialog}
    onclose={() => {
        isOpen = false;
    }}
>
    <div>
        {locale.ui?.about.about_text}
        <a href="https://www.gnu.org/licenses/agpl-3.0.en.html"
            >{locale.ui?.about.gnu_href_text}.</a
        >
    </div>
    <button
        onclick={() => {
            isOpen = false;
        }}>{locale.ui?.generic.close}</button
    >
</dialog>
