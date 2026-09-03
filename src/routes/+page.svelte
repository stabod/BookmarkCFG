<script>
  import { setContext } from 'svelte';
  import { SvelteSet } from 'svelte/reactivity';
  import BookmarkNode from './BookmarkNode.svelte';
  import Editor from './Editor.svelte';
  import Popup from './Popup.svelte';
  import { selectedBookmark } from '../lib/selectedBookmark.svelte.js'
  import { parseHTML, exportHTML } from '$lib/importExport';

  let bookmarkData = $state(null);
  let errorMsg = $state("");

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

  let foldedSet = new SvelteSet();
  setContext('folded', new SvelteSet());

</script>

<title>BookmarkCFG Editor</title>
<main class="container">
  <h1 class="title">BookmarkCFG</h1>
  <section class="toolbar">
    <label for="HTML-file-upload-input">Import Bookmarks HTML</label>
    <input class="file-upload" id="HTML-file-upload-input" type="file" accept=".html" onchange={handleHTMLUpload} />
    {#if bookmarkData}
      <button onclick={() => exportHTML(bookmarkData)} class="btn">Export Bookmarks</button>
      <button onclick={unloadBookmarkData} class="btn">Unload Bookmarks</button>
    {/if}
  </section>

  {#if errorMsg}
    <p class="error">{errorMsg}</p>
  {/if}

  {#if bookmarkData}
    <div class="workspace">
      <div class="pane">
        {#each bookmarkData.children as child}
          <BookmarkNode node={child} />
        {/each}
      </div>
      <div class="pane">
          <Editor/>
      </div>
    </div>
  {/if}

  <div>
    <h2>Instructions</h2>
    <p>When a file is uploaded, two panes will appear. The left pane shows a tree view of the uploaded bookmarks. 
       Clicking on any bookmark or folder selects it. The right pane shows fields and buttons that can be used to edit the selected bookmark.</p>
  </div>
</main>

<style>
  :global(body) {
    font-family: sans-serif;
    background-color: var(--primaryColor);
    color: var(--textColor);
    margin: 0;
    padding: 24px;
  }

  .container { 
    margin: 0 auto; 
  }

  .title {
    font-weight: bold;
  }

  .toolbar { 
    display: flex; 
    flex-direction: row;
    gap: 16px; 
    margin-bottom: 24px; 
  }

  .file-upload {
    background: var(--highlightColor);
    padding: 10px 18px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
  }

  .file-upload input { 
    display: none; 
  }

  .btn {
    background-color: var(--highlightColor);
    padding: 10px 18px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
  }

  .workspace {
    display: flex;
    flex-direction: row;
    gap: 24px;
  }
  
  .pane {
    background: var(--secondaryColor);
    border: 4px solid var(--highlightColor);
    border-radius: 8px;
    padding: 20px;
    overflow-y: scroll;
    height: 80vh;
    width: 50%;
  }

  @media (max-width: 768px) {
    .toolbar {
      flex-direction: column;
    }
    .file-upload {
      width: 80%;
    }
    .btn {
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