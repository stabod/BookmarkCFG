<script>
  import { setContext } from 'svelte';
  import { browser } from '$app/environment';
  import { SvelteSet } from 'svelte/reactivity';
  import Workspace from './Workspace.svelte';
  import HelpPopup from './HelpPopup.svelte';
  import { selectedBookmark } from '../lib/selectedBookmark.svelte.js'
  import { parseHTML, exportHTML } from '$lib/importExport';

  let bookmarkData = $state(null);
  let errorMsg = $state("");
  let isDark = browser ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;

  setContext('folded', new SvelteSet());
  setContext('bookmarkData', () => bookmarkData);

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      bookmarkData = parseHTML(text);
    } catch (err) {
      errorMsg = err.message;
      bookmarkData = null;
    }
    selectedBookmark.selectNew(null, null, null);
  }

  function unloadBookmarkData() {
    bookmarkData = null;
    selectedBookmark.selectNew(null, null);
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
      <button class="btn" onclick={changeTheme}>Change Theme</button>
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

{#snippet toolbarElements()}
  <div class="toolbar">
     <button class="strech-button" onclick={() => exportHTML(bookmarkData)}>Export as HTML</button>
     <button class="strech-button warning" onclick={unloadBookmarkData}>Unload bookmarks</button>
   </div>
{/snippet}



<title>BookmarkCFG Editor</title>
<main class="main-container">
  {@render titleElements()}
  
  {#if errorMsg}
    <p class="error">{errorMsg}</p>
  {/if}

  {#if !bookmarkData}
    {@render uploadElements()}
  {:else}
    {@render toolbarElements()}
    <Workspace/>
  {/if}
</main>

<style>
  :global(body) {
    font-family: sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
    margin: 16px;
    display: flex;
    flex-direction: column;
    min-height: 95vh;
  }

  .main-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
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

  .toolbar { 
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
    column-gap: 16px;
    margin: 8px;
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
  
  .warning {
    background-color: var(--warning-color);
  }

  @media (max-width: 768px) {
    .toolbar {
      flex-direction: column;
    }
    .file-upload {
      width: 80%;
    }
    .workspace {
      flex-direction: column;
      height: 80vh;
    }
    .pane {
      width: 80%;
      height: 50vh;
    }
  }

  .error { color: #ff4a4a; }
</style>