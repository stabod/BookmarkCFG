<script>
    import Popup from "./Popup.svelte";
</script>

{#snippet instructionsSnippet()}
    <h3>Loading File</h3>
    <p>Use the file upload dialog to load a HTML bookmark file.</p>
    <h3>Using the tree view and editor</h3>
    <p>When a file is uploaded, two panes will appear. The left pane shows a tree view of the uploaded bookmarks. 
       Clicking on any bookmark or folder selects it. Folders have a button next to them to fold and unfold.</p>
    <p>The right pane shows fields and buttons that can be used to edit the selected bookmark.
        The available fields depend on what is selected.</p>
{/snippet}

<Popup buttonText="Help" title="Instructions" children={instructionsSnippet}/>