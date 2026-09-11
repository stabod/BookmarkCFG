import { Bookmark } from "$lib/bookmark.svelte.js"

export const HTML_HEADER = '<!DOCTYPE NETSCAPE-Bookmark-file-1>\n<\
!-- This is an automatically generated file.\n\
    It will be read and overwritten.\n\
    DO NOT EDIT! -->\n\
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n\
<TITLE>Bookmarks</TITLE>\n';

export const ELEMENT_TAG = "<DT>";
export const OPEN_CONTAINER_TAG = "<DL><p>\n";
export const CLOSE_CONTAINER_TAG = "</DL><p>\n";

export const HEADER_TAGS = new Set(["H1", "H3"]);
export const BOOKMARK_TAGS = new Set(["A"]);
export const ALLOWED_TAGS = HEADER_TAGS.union(BOOKMARK_TAGS);

export function escapeHTML(str) {
    const replacements = [
        [/</g, '&lt;'], [/>/g, '&gt;'],
        [/&/g, '&amp;'], [/\'/g, '&#39;']
        ]; 
    let newStr = str;
    for (let r of replacements) {
        newStr = newStr.replace(r[0], r[1])
    }
    return newStr;
}

/* Removes unnecessary tags and then returns
 * a new DOMParser with the HTML parsed.
 */
export function parseHTML(text) {
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
export function HTMLToObject(element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_ALL);
  const result = [];
  const parentMap = new Map();
  let current = walker.nextNode();

  while (current) {
    if (!ALLOWED_TAGS.has(current.tagName)) {
      current = walker.nextNode();
      continue;
    }
    const newobj = new Bookmark(current);
    const cont = parentMap.has(current.parentNode) ? parentMap.get(current.parentNode) : result;
    cont.push(newobj);
    if (HEADER_TAGS.has(current.tagName)) {
      const sibling = current.nextElementSibling;
      if (sibling && sibling.tagName === "DL") {
        parentMap.set(sibling, newobj.children);
      } else {
        throw "Invalid file format";
      }
    }
    current = walker.nextNode();
  }

  return result[0];
}