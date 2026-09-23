import { beforeAll, describe, expect, test} from 'vitest'
import { Bookmark } from '$lib/bookmark.svelte.js'
import { exampleInputAttributes, correctlyParsedAttributes } from '$lib/tests/test-constants.js'

let parsedAttributes;
let newBookmark;

beforeAll(() => {
    parsedAttributes = Bookmark.parseAttributes(exampleInputAttributes);
    newBookmark = Bookmark.newBookmark();
})

describe('Bookmark', () => {
    test('parses attributes correctly', () => {
        expect(parsedAttributes.last_modified).toBe(correctlyParsedAttributes.last_modified)
        expect(parsedAttributes.add_date).toBe(correctlyParsedAttributes.add_date)
        expect(parsedAttributes.icon).toBeUndefined()
    })
})