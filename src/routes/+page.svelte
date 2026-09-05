<script>
  import { setContext } from 'svelte';
  import { browser } from '$app/environment';
  import { SvelteSet } from 'svelte/reactivity';
  import BookmarkNode from './BookmarkNode.svelte';
  import Editor from './Editor.svelte';
  import HelpPopup from './HelpPopup.svelte';
  import { selectedBookmark } from '../lib/selectedBookmark.svelte.js'
  import { parseHTML, exportHTML } from '$lib/importExport';

  let bookmarkData = $state(null);
  let errorMsg = $state("");
  let isDark = browser ? window.matchMedia('(prefers-color-scheme: dark)').matches : false; 

  function handleHTMLUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
          const text = e.target.result;
          const obj = parseHTML(text);
          bookmarkData = obj;
      } catch (err) {
        errorMsg = err;
      }
      selectedBookmark.selectNew(null, null);
    }
    reader.readAsText(file);
  } 
 
  function unloadBookmarkData() {
    bookmarkData = null;
    selectedBookmark.selectNew(null, null);
  }

  setContext('folded', new SvelteSet());

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
  <div style="flex: 1; display:flex; justify-content: center; align-items: center;">
      <label class="upload-dialog" for="HTML-file-upload-input">
        <span>Import bookmarks</span>
        <input class="file-upload" id="HTML-file-upload-input" type="file" accept=".html" onchange={handleHTMLUpload} />
      </label>
    </div>
{/snippet}

{#snippet toolbarElements()}
  <div class="toolbar">
     <button onclick={() => exportHTML(bookmarkData)} class="btn">Export as HTML</button>
     <button onclick={unloadBookmarkData} class="btn warning">Unload bookmarks</button>
   </div>
{/snippet}

{#snippet workspaceElements()}
  <div class="workspace">
      <section class="pane">
        <h2>Bookmark Tree</h2>
        {#each bookmarkData.children as child}
          <BookmarkNode node={child} />
        {/each}
      </section>
      <section class="pane">
        <h2>Editor</h2>
        <Editor/>
      </section>
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
    {@render workspaceElements()}
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
    display: grid; 
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    column-gap: 16px;
    margin: 8px;
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
  
  .workspace {
    display: flex;
    flex-direction: row;
    max-height: 675px;
    gap: 24px;
  }
  
  .pane {
    background: var(--surface-color);
    border: 4px solid var(--border-color);
    border-radius: 8px;
    padding: 20px;
    max-height: 80%;
    overflow-y:scroll;
    width: 50%;
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