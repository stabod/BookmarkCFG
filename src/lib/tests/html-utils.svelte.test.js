import { beforeAll, describe, expect, test } from "vitest";
import { HTMLToObject, parseHTML } from "$lib/html-utils";
import {
    correctlyParsedAttributes,
    exampleCorrectObject,
    exampleHTML,
    exampleInvalidHTML,
} from "./test-constants";
import { Bookmark } from "$lib/bookmark.svelte";

let parseObj;
let bookmarkObj;
let invalidParsed;

beforeAll(() => {
    parseObj = parseHTML(exampleHTML);
    bookmarkObj = HTMLToObject(parseObj);
    invalidParsed = parseHTML(exampleInvalidHTML);
});

describe("HTMLToObject", () => {
    (test("properly parses valid HTML format", () => {
        expect(bookmarkObj).toBeInstanceOf(Bookmark);
        expect(bookmarkObj.id).toBe(exampleCorrectObject.id);
        expect(bookmarkObj.text).toBe(exampleCorrectObject.text);
        expect(JSON.stringify(bookmarkObj)).toEqual(
            JSON.stringify(exampleCorrectObject),
        );
    }),
        test("throws on invalid format", () => {
            expect(() => HTMLToObject(invalidParsed)).toThrow();
        }));
});
