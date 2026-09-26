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

<title>BookmarkCFG Editor</title>
<main class="main-container">
  <div class="title-controls">
    <h1 class="title">BookmarkCFG</h1>
    <div>
      <HelpPopup/>
      <button class="hidden-button" onclick={changeTheme}>Change Theme</button>
    </div>
  </div>
  {#if errorMsg}
    <p class="warning">{errorMsg}</p>
  {/if}

  {#if !bookmarkData.isLoaded()}
    <div class="upload-holder">
    <p>BookmarkCGG allows you to edit your bookmarks file. To begin, press one of the buttons below:</p>
      <label class="upload-label" for="HTML-file-upload-input">
        <span>Import bookmarks file</span>
        <input class="visually-hidden" id="HTML-file-upload-input" type="file" accept=".html" onchange={handleUpload}/>
      </label>
      <button onclick={() => bookmarkData.newTree()}>Create new file</button>
    </div>
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
    background: var(--surface-color);
    display: flex; 
    flex-direction: column;
    justify-content: center; 
    align-items: center;
    padding: 8px 8px;
    border: 4px outset var(--border-color);
    border-radius: 4px;
    position: absolute;
    top: 25%;
    left: 23.33%;
    height: 50%;
    width: 50%;

  }

  .upload-label:hover {
    background-color: var(--accent-color-3);
  }

  .upload-label:active {
    border-style: inset;
  }
  
  @media (max-width: 768px) {
    .upload-holder {
      width: 80%;
    }
  }

</style>