<script>
  import { setContext } from 'svelte';
  import { browser } from '$app/environment';
  import { SvelteSet } from 'svelte/reactivity';
  import Workspace from '$lib/components/Workspace.svelte';
  import HelpPopup from '$lib/components/HelpPopup.svelte';
  import { BookmarkData } from '$lib/bookmark-data.svelte.js'; 
  import { Selection } from '$lib/selection.svelte.js';

  const bookmarkData = new BookmarkData();
  const selection = new Selection(bookmarkData);
  let errorMsg = $state("");
  let isDark = browser ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;

  setContext('folded', new SvelteSet());
  setContext('bookmarkData', bookmarkData);
  setContext('selection', selection);

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      bookmarkData.loadHTML(text);
    } catch (err) {
      errorMsg = err;
      bookmarkData.clear();
    }
  }

  function changeTheme() {
    if (isDark) {
      document.documentElement.setAttribute('force-theme', 'light');
      isDark = false;
    } else {
      document.documentElement.setAttribute('force-theme', 'dark');
      isDark = true;
    }
  }
</script>

{#snippet titleElements()}
  <div class="title-controls">
    <h1 class="title">BookmarkCFG</h1>
    <div>
      <HelpPopup/>
      <button class="hidden-button" onclick={changeTheme}>Change Theme</button>
    </div>
  </div>
{/snippet}

{#snippet uploadElements()}
  <div class="upload-holder">
      <label class="upload-dialog" for="HTML-file-upload-input">
        <span>Import bookmarks</span>
        <input class="file-upload" id="HTML-file-upload-input" type="file" accept=".html" onchange={handleUpload}/>
      </label>
    </div>
{/snippet}

<title>BookmarkCFG Editor</title>
<main class="main-container">
  {@render titleElements()}
  
  {#if errorMsg}
    <p class="warning">{errorMsg}</p>
  {/if}

  {#if !bookmarkData.isLoaded()}
    {@render uploadElements()}
  {:else}
    <Workspace/>
  {/if}
</main>

<style>
  :global(body) {
    font-family: sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100dvh;
    overflow: hidden;
    display: flex;
    justify-content: center;
  }

  .main-container {
    display: flex;
    flex-direction: column;
    height: 97.5%;
    width: 95%;
  }

  .title {
    font-weight: bold;
    font-size: 2em;
  }

  .title-controls {
    display:flex;
    flex-direction: row;
    justify-content:space-between;
    align-items: center;
  }

  .upload-holder {
    display:flex; 
    justify-content: center; 
    align-items: center;
  }

  .upload-dialog {
    background: var(--surface-color);
    color: var(--text-color);
    padding: 8px 8px;
    border: 4px outset var(--border-color);
    border-radius: 4px;
    cursor: pointer;
    height: 50%;
    width: 50%;
    display: flex;
    position: absolute;
    top: 25%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  @media (max-width: 768px) {
    .toolbar {
      flex-direction: column;
    }
    .file-upload {
      width: 80%;
    }
  }

</style>