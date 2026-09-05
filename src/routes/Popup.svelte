<script>
  let { buttonText, title, children } = $props();
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

<button class="btn" onclick={() => {isOpen = true;}}>{buttonText}</button>

<dialog bind:this={dialog}>
  <h2>{title}</h2>
  {@render children()}
  <button class="btn" onclick={() => {isOpen = false;}}>Close</button>
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
</style>