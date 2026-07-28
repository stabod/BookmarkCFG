function swapNodes(array, indexA, indexB) {
   if (indexA < 0 || indexB < 0 || indexA >= array.length || indexB >= array.length) return;

    const temp = array[indexA];
    array[indexA] = array[indexB];
    array[indexB] = temp;

    array[indexA].index = indexA;
    array[indexB].index = indexB; 
}

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
        const currentIndex = this.bookmark.index;
        if (currentIndex <= 0) return;

        const parent = this.lineage.at(-1);
        const siblings = parent?.children;
        if (!siblings) return;

        swapNodes(siblings, currentIndex, currentIndex - 1);
    },
    moveDown() {
        if (this.bookmark == null || this.lineage.lenght === 0) return;
        const currentIndex = this.bookmark.index;

        const parent = this.lineage.at(-1);
        const siblings = parent?.children;
        if (!siblings || currentIndex >= siblings.lenght - 1) return;

        swapNodes(siblings, currentIndex, currentIndex + 1)
    }
})

