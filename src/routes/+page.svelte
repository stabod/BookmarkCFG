<script>
  import BookmarkNode from './BookmarkNode.svelte'
  import Editor from './Editor.svelte'

  let bookmarkData = $state(null);
  let errorMsg = $state("");

  let selectedNode = $state(null);
  let selectedLineage = $state([]);

  function handleSelect(node, lineage) {
    selectedNode = node;
    selectedLineage = lineage;
  }
  
  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        bookmarkData = JSON.parse(e.target.result);
        errorMsg = "";
      } catch (err) {
        errorMsg = "Invalid JSON file.";
        bookmarkData = null;
      }
      selectedNode.clear();
    };
    reader.readAsText(file);
  }

  function exportJSON() {
    if (!bookmarkData) return;
    const jsonString = JSON.stringify(bookmarkData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "firefox_bookmarks_edited.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function unloadJSON() {
    bookmarkData = null;
    editingData = null;
  }

  function swapNodes(array, nodeA, nodeB) {
    array[nodeB.index] = nodeA;
    array[nodeA.index] = nodeB;
    nodeA.index -= 1;
    nodeB.index += 1;
  }

  function moveUpSelected() {
    if (selectedNode == null || selectedLineage == null) return;
    if (selectedNode.index == 0) return;
    const parent = selectedLineage.at(selectedLineage.length - 1);
    const siblings = parent.children;
    let previous = siblings.at(selectedNode.index - 1);
    swapNodes(siblings, selectedNode, previous);
  }

  function moveDownSelected() {
    if (selectedNode == null || selectedLineage == null) return;
    const parent = selectedLineage.at(selectedLineage.length - 1);
    const siblings = parent.children;
    if (selectedNode.index == siblings.length - 1) return;
    let next = siblings.at(selectedNode.index + 1);
    swapNodes(siblings, next, selectedNode);
  }

  const moveActions = {
    moveUp: moveUpSelected,
    moveDown: moveDownSelected
  }

</script>


<main class="container">
  <div class="toolbar">
    <label class="file-upload">
      Import Bookmarks JSON
      <input type="file" accept=".json" onchange={handleFileUpload} />
    </label>
    {#if bookmarkData}
      <button onclick={exportJSON} class="export-btn">Export Bookmarks</button>
    {/if}
    {#if bookmarkData}
      <button onclick={unloadJSON} class="export-btn">Unload Bookmarks</button>
    {/if}
  </div>

  {#if errorMsg}
    <p class="error">{errorMsg}</p>
  {/if}

  {#if bookmarkData}
    <div class="workspace">
      <div class="pane tree-pane">
        {#if bookmarkData.children}
          {#each bookmarkData.children as child}
            <BookmarkNode node={child} selected={selectedNode} onSelect={handleSelect} />
          {/each}
        {:else}
          <p>No compatible bookmark entries discovered.</p>
        {/if}
      </div>
      <div class="editor-card">
          <Editor bind:selected={selectedNode} bind:lineage={selectedLineage} actions={moveActions}/>
      </div>
    </div>
  {/if}
</main>

<style>
  :global(body) {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    background-color: #121212;
    color: #e0e0e0;
    margin: 0;
    padding: 24px;
  }
  .container { margin: 0 auto; }
  .toolbar { display: flex; gap: 16px; margin-bottom: 24px; }
  
  .file-upload {
    background: #ff3e00;
    padding: 10px 18px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
  }
  .file-upload input { display: none; }
  .export-btn {
    background: #00b4d8;
    border: none;
    padding: 10px 18px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    color: #050505;
  }
 
  .workspace {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    height: calc(100vh - 180px);
    min-height: 500px;
  }
  .pane {
    background: #1e1e1e;
    border: 1px solid #333;
    border-radius: 8px;
    padding: 20px;
    overflow-y: auto;
  }
  
  /* Tree Navigation Components */


  /* Right Inspector Layout styles */
  .editor-card { background: #262626; padding: 20px; border-radius: 6px; border: 1px solid #444; }
  .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
  .field span { font-size: 0.85rem; color: #aaa; text-transform: uppercase; letter-spacing: 0.5px; }
  input[type="text"] {
    background: #121212;
    border: 1px solid #444;
    color: #fff;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 1rem;
  }
  .url-field { color: #00b4d8; }
  .hint-text { font-size: 0.8rem; color: #666; margin-top: 20px; text-align: right; }
  .empty-state { text-align: center; color: #777; padding-top: 100px; font-style: italic; }
  
  .placeholder { text-align: center; color: #666; padding: 60px; border: 2px dashed #333; border-radius: 8px; margin-top: 40px; }
  .error { color: #ff4a4a; }
</style>