export const selection = $state({
    bookmark: null,
    lineage: [],
    selectNew(bookmark, lineage) {
        this.bookmark = bookmark;
        this.lineage = lineage;
    },
    clear() {
        this.bookmark = null;
        this.lineage = [];
    },
    moveUp() {
        if (this.bookmark == null || this.lineage == null) return;

        const parent = this.lineage.at(-1);
        if (!parent) return;

        const siblings = parent?.children;
        if (!siblings || siblings.length == 1) return;

        const index = siblings.indexOf(this.bookmark);
        if (index == 0) return;

        const previous = index - 1;
        const tmp = siblings[index];
        siblings[index] = siblings[previous];
        siblings[previous] = tmp;
    },
    moveDown() {
        if (this.bookmark == null || this.lineage == null) return;

        const parent = this.lineage.at(-1);
        if (!parent) return;

        const siblings = parent?.children;
        if (!siblings || siblings.length == 1) return;

        const index = siblings.indexOf(this.bookmark);
        if (index == (siblings.length - 1)) return;

        const next = index + 1;
        const tmp = siblings[index];
        siblings[index] = siblings[next];
        siblings[next] = tmp;
    }
})

