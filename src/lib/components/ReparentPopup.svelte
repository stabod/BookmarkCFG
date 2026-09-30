<script>
  import { getContext, setContext } from "svelte";
  import BookmarkNode from "./BookmarkNode.svelte";
  import { Selection } from "$lib/selection.svelte";

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

<button onclick={() => (checkOpen())} onclose={() => {isOpen = false;}}>
      {locale.ui?.editor.change_parent_button}</button>

<dialog bind:this={dialog}>
  <div class="dialog-holder">
    <div>
      <p>{locale.ui?.editor.change_parent_title}</p>
      <BookmarkNode node={data.getBookmarks()} />
    </div>
    <div>
      <p>{locale.ui?.editor.change_parent_text} {selection.getNumberSelected()} {selection.getNumberSelected() > 1 ? locale.ui?.generic.bookmark_plural : locale.ui?.generic.bookmark_singular}</p>
      <button onclick={() => doReparent()}>{locale.ui?.generic.confirm}</button>
      <button onclick={() => { isOpen = false; }}>{locale.ui?.generic.close}</button>
    </div>
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
    flex-direction: row;
  }
</style>
