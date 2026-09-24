import { beforeAll, describe, test, expect } from "vitest";
import { BookmarkData } from "$lib/bookmark-data.svelte.js";
import { exampleCorrectObject, exampleCorrectArray, exampleCorrectParentMap, exampleHTML } from "./test-constants";

let bookmarkData;
let bookmarkArray;
let bookmarkMap;

beforeAll(() => {
    bookmarkData = new BookmarkData();
    bookmarkData.loadHTML(exampleHTML);
    bookmarkArray = $state.snapshot(bookmarkData.bookmarkArray);
    bookmarkMap = $state.snapshot(bookmarkData.parentMap);
});

describe('BookmarkData', () => {
    test('correctly derives secondary structures', () => {
        expect(JSON.stringify(bookmarkArray)).toEqual(JSON.stringify(exampleCorrectArray))
        expect(JSON.stringify(bookmarkMap)).toEqual(JSON.stringify(exampleCorrectParentMap))
    })
})
