<script>
    import { setContext } from "svelte";
    import { SvelteSet } from "svelte/reactivity";
    import { browser } from "$app/env";
    import Workspace from "#lib/components/Workspace.svelte";
    import HelpPopup from "#lib/components/HelpPopup.svelte";
    import LanguageChange from "#lib/components/LanguageChange.svelte";
    import AboutPopup from "#lib/components/AboutPopup.svelte";
    import { BookmarkData } from "#lib/bookmark-data.svelte.js";
    import { Selection } from "#lib/selection.svelte.js";
    import { Locale } from "#lib/locale.svelte";

    const bookmarkData = new BookmarkData();
    const selection = new Selection(bookmarkData);
    const locale = new Locale();
    let errorMsg = $state("");
    let isDark = browser
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
        : false;

    setContext("folded", new SvelteSet());
    setContext("bookmarkData", bookmarkData);
    setContext("selection", selection);
    setContext("locale", locale);

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
            document.documentElement.setAttribute("force-theme", "light");
            isDark = false;
        } else {
            document.documentElement.setAttribute("force-theme", "dark");
            isDark = true;
        }
    }
</script>

<title>BookmarkCFG Editor</title>
<main class="main-container">
    <div class="title-controls">
        <h1 class="title">BookmarkCFG</h1>
        <div>
            <LanguageChange />
            <button class="hidden-button" onclick={changeTheme}
                >{locale.ui?.top.change_theme_button}</button
            >
            <AboutPopup />
        </div>
    </div>
    {#if errorMsg}
        <p class="warning">{errorMsg}</p>
    {/if}

    {#if !bookmarkData.isLoaded()}
        <div class="upload-holder">
            <p class="welcome-text">{locale.ui?.top.welcome_text}</p>
            <div class="upload-button-holder">
                <label class="upload-label" for="HTML-file-upload-input">
                    <div style="text-align: center;">
                        {locale.ui?.top.import_html_button}
                    </div>
                    <input
                        class="visually-hidden"
                        id="HTML-file-upload-input"
                        type="file"
                        accept=".html"
                        onchange={handleUpload}
                    />
                </label>
                <button onclick={() => bookmarkData.newTree()}
                    >{locale.ui?.top.create_new_file_button}</button
                >
            </div>
        </div>
    {:else}
        <Workspace />
    {/if}
</main>

<style>
    :global(body) {
        font-family: sans-serif;
        background-color: var(--background-color);
        color: var(--text-color);
        margin: 0;
        padding: 0;
        width: 100dvw;
        height: 100dvh;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .main-container {
        display: flex;
        flex-direction: column;
        margin: 16px;
        height: 95%;
        width: 95%;
    }

    .title {
        font-weight: bold;
        font-size: 2em;
    }

    .title-controls {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .upload-holder {
        flex: 1;
        background: var(--surface-color);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 4px outset var(--border-color);
        border-radius: 4px;
    }

    .welcome-text {
        margin: 4px;
        font-size: large;
    }

    .upload-button-holder {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 50%;
    }

    .upload-label:hover {
        background-color: var(--accent-color-3);
    }

    .upload-label:active {
        border-style: inset;
    }
</style>
