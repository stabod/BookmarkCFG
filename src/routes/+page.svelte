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
          let text = e.target.result;
          text = text.replaceAll(/<DT>/g, "");
          text = text.replaceAll(/<p>/g, "");
          console.log(text);
          const parser = new DOMParser();
          const parsedData = parser.parseFromString(text, "text/html")
          const obj = parseHTML(parsedData); 
          console.log(parsedData.body);
          console.log("----------------");
          console.log(obj)
          bookmarkData = obj;
      } catch (err) {
        errorMsg = err;
      }
    }
    reader.readAsText(file);
  } 

  function parseHTML(element) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_ALL);
    const stack = [];
    const containers = new Set(["H1", "H3"]);
    const bookmarks = new Set(["A"]);
    const allowed = containers.union(bookmarks);

    let current = walker.nextNode();
    while (current) {
      if (allowed.has(current.tagName)) {
        stack.push(newObject(current));
      }
      current = walker.nextNode();
    }

    let newChildren = [];
    let bottom = stack[0];
    let top = null;
    while (stack.length > 0) {
      top = stack.pop();
      if (bookmarks.has(top.tag)) {
        newChildren.unshift(top);
      } else if (containers.has(top.tag)) {
        top.children = [...newChildren];
        newChildren = [];
        newChildren.unshift(top);
      }
    }
    return bottom;
  }

  function newObject(element) {
    const obj = {
      tag: element.tagName,
      attributes: {},
      children: [],
      text: ""
    };

    if (element.hasAttributes()) {
      for (const attr of element.attributes) {
        obj.attributes[attr.name] = attr.value;
      }
    }

    const trimmed = element.textContent.trim();
    if (trimmed) {
      obj.text += (obj.text ? " " : "") + trimmed;
    }

    return obj;
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
    selection.selectNew(null, null);
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
        <BookmarkNode node={bookmarkData} />
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
    overflow-y: scroll;
    height: 80vh;
    width: 50%;
  }

  .pane-title {
    border-bottom: solid;
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