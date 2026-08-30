<script>
  import BookmarkNode from './BookmarkNode.svelte';
  import Editor from './Editor.svelte';
  import { selection } from './selectedBookmark.svelte.js'

  let bookmarkData = $state(null);
  let errorMsg = $state("");

  function handleJSONUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        bookmarkData = JSON.parse(e.target.result);
        errorMsg = "";
      } catch (err) {
        errorMsg = "Invalid JSON file.";
      }
    };
    reader.readAsText(file);
  }

  function handleHTMLUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
          const parser = new DOMParser();
          const parsedData = parser.parseFromString(e.target.result, "text/html")
          const obj = elementToObj(parsedData.body);
          console.log(obj.children)
      } catch (err) {
        errorMsg = "Failed to read HTML.";
      }
    }
    reader.readAsText(file);
  } 

  function elementToObj(element) {
    const obj = {
      tag: element.tagName.toLowerCase(),
      attributes: {},
      children: [],
      text: ""
    };

    if (element.hasAttributes()) {
      for (const attr of element.attributes) {
        obj.attributes[attr.name] = attr.value;
      }
    }

    for (const child of element.childNodes) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        obj.children.push(elementToObj(child));
      } else if (child.nodeType === Node.TEXT_NODE) {
        const trimmed = child.textContent.trim();
        if (trimmed) {
          obj.text += (obj.text ? " " : "") + trimmed;
        }
      }
    }

    return obj;
  }

  function exportData(data, dataType, fileName) {
    const blob = new Blob([data], { type: dataType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportJSON(data) {
    const jsonString = JSON.stringify(data, null, 2);
    exportData(jsonString, "application/json", "bookmarks.json");
  }

  function unloadBookmarkData() {
    bookmarkData = null;
    editingData = null;
  }

</script>

<main class="container">
  <h1 class="title">BookmarkCFG</h1>
  <div class="toolbar">
    <label class="file-upload">
      Import Bookmarks JSON
      <input type="file" accept=".json" onchange={handleJSONUpload} />
    </label>
    <label class="file-upload">
      Import Bookmarks HTML
      <input type="file" accept=".html" onchange={handleHTMLUpload} />
    </label>
    <button>Export HTML</button>
    {#if bookmarkData}
      <button onclick={exportJSON} class="btn">Export Bookmarks</button>
      <button onclick={unloadBookmarkData} class="btn">Unload Bookmarks</button>
    {/if}
  </div>

  {#if errorMsg}
    <p class="error">{errorMsg}</p>
  {/if}

  {#if bookmarkData}
    <div class="workspace">
      <div class="pane">
        {#if bookmarkData.children}
          {#each bookmarkData.children as child}
            <BookmarkNode node={child} />
          {/each}
        {:else}
          <p>No compatible bookmark entries discovered.</p>
        {/if}
      </div>
      <div class="pane">
          <Editor/>
      </div>
    </div>
  {/if}
</main>

<style>
  :global(body) {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    background-color: #303030;
    color: #e0e0e0;
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
    background: #175200;
    padding: 10px 18px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
  }

  .file-upload input { 
    display: none; 
  }

  .btn {
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
    background: #1e1e1e;
    border: 4px solid #333;
    border-radius: 8px;
    padding: 20px;
    overflow-y: auto;
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