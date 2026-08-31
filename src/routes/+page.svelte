<script>
  import BookmarkNode from './BookmarkNode.svelte';
  import Editor from './Editor.svelte';
  import { selection } from './selectedBookmark.svelte.js'

  let bookmarkData = $state(null);
  let errorMsg = $state("");

  function handleHTMLUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
          const text = e.target.result;
          const parsed = parseHTML(text);
          const obj = HTMLToObject(parsed); 
          bookmarkData = obj;
      } catch (err) {
        errorMsg = err;
      }
      selection.selectNew(null, null);
    }
    reader.readAsText(file);
  } 

  function parseHTML(text) {
    let rpl = text;
    rpl = rpl.replaceAll(/<DT>/g, "");
    rpl = rpl.replaceAll(/<p>/g, "");
    const parser = new DOMParser();
    const parsedData = parser.parseFromString(rpl, "text/html")
    return parsedData;
  }
  
  /* Non-recursive approach that uses a Map to link
   * between the DL elements and the header elements.
   * Flatteing the sturcture like this makes it easier
   * to work with.
   */
  function HTMLToObject(element) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_ALL);
    const headers = new Set(["H1", "H3"]);
    const bookmarks = new Set(["A"]);
    const allowed = headers.union(bookmarks);

    const result = [];
    const parentMap = new Map();
    let cont = result;

    let current = walker.nextNode();
    while (current) {
      if (!allowed.has(current.tagName)) {
        current = walker.nextNode();
        continue;
      }
      const newobj = newHTMLObject(current);
      cont = parentMap.has(current.parentNode) ? parentMap.get(current.parentNode) : result;
      cont.push(newobj);
      if (headers.has(current.tagName)) {
        const sibling = current.nextElementSibling;
        if (sibling && sibling.tagName === "DL") {
          parentMap.set(sibling, newobj.children);
        }
      }
      current = walker.nextNode();
    }

    return result[0];
  }

  function newHTMLObject(element) {
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

  function escapeHTML(str) {
    const replacements = [[/</g, '&lt;'], [/>/g, '&gt;'], [/&/g, '&amp;'], [/\'/g, '&#39;']];
    let newStr = str;
    for (let r of replacements) {
      newStr = newStr.replace(r[0], r[1])
    }
    return newStr;
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

  /* This is a non-recursive Depth-First Search approach
   * It is messy, as it needs to reinsert the <DL>, <DT>
   * and <p> tags back into the structure.
   */
  function exportHTML() {
  let text='<!DOCTYPE NETSCAPE-Bookmark-file-1>\n<\
!-- This is an automatically generated file.\n\
     It will be read and overwritten.\n\
     DO NOT EDIT! -->\n\
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n\
<TITLE>Bookmarks</TITLE>\n';
    const headers = new Set(["H1", "H3"]);
    const stack = [];
    stack.push({node: bookmarkData, visited:false, depth: 0});

    while (stack.length > 0) {
      let top = stack.pop();
      let string = "";
      let attributeString = "";
      let indent = "    ".repeat(top.depth);
      string = string + indent

      if (!top.visited) {
        for (const [key, value] of Object.entries(top.node.attributes)) {
          attributeString += ` ${key.toUpperCase()}="${value}"`;
        }
        if (top.depth > 0) {
          string = string + "<DT>"
        }
        string = string + `<${top.node.tag}${attributeString}>${escapeHTML(top.node.text)}</${top.node.tag}>\n`;
        if (headers.has(top.node.tag)) {
          string = string + indent + "<DL><p>\n"
          stack.push({node: top.node, visited: true, depth: top.depth});
          for (let i = top.node.children.length - 1; i >= 0 ; i--) {
            stack.push({node: top.node.children[i], visited:false, depth: top.depth+1});
          }
        }
      } else {
        string = string + "</DL><p>\n";
      }
      text += string;
    }
    exportData(text, "text/html", "bookmarkcfg-out.html");
  }

  function unloadBookmarkData() {
    bookmarkData = null;
    selection.selectNew(null, null);
  }

</script>

<main class="container">
  <h1 class="title">BookmarkCFG</h1>
  <div class="toolbar">
    <label class="file-upload">
      Import Bookmarks HTML
      <input type="file" accept=".html" onchange={handleHTMLUpload} />
    </label>
    {#if bookmarkData}
      <button onclick={exportHTML} class="btn">Export Bookmarks</button>
      <button onclick={unloadBookmarkData} class="btn">Unload Bookmarks</button>
    {/if}
  </div>

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