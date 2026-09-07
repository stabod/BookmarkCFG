import { HEADER_TAGS, BOOKMARK_TAGS, ALLOWED_TAGS, escapeHTML, Bookmark } from "$lib/bookmark.svelte.js"

const HTML_HEADER = '<!DOCTYPE NETSCAPE-Bookmark-file-1>\n<\
!-- This is an automatically generated file.\n\
    It will be read and overwritten.\n\
    DO NOT EDIT! -->\n\
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n\
<TITLE>Bookmarks</TITLE>\n';

/* Non-recursive approach that uses a Map to link
 * between the DL elements and the header elements.
 * Flatteing the sturcture like this makes it easier
 * to work with.
 */
function HTMLToObject(element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_ALL);
  const result = [];
  const parentMap = new Map();
  let cont = result;

  let current = walker.nextNode();
  while (current) {
    if (!ALLOWED_TAGS.has(current.tagName)) {
      current = walker.nextNode();
      continue;
    }
    const newobj = new Bookmark(current);
    cont = parentMap.has(current.parentNode) ? parentMap.get(current.parentNode) : result;
    cont.push(newobj);
    if (HEADER_TAGS.has(current.tagName)) {
      const sibling = current.nextElementSibling;
      if (sibling && sibling.tagName === "DL") {
        parentMap.set(sibling, newobj.children);
      }
    }
    current = walker.nextNode();
  }

  return result[0];
}

export function parseHTML(text) {
  let rpl = text;
  rpl = rpl.replaceAll(/<DT>/g, "");
  rpl = rpl.replaceAll(/<p>/g, "");
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(rpl, "text/html")
  return HTMLToObject(parsedData);
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

class BookmarkStackFrame {
    constructor(node, visited, depth) {
      this.node = node;
      this.visited = visited;
      this.depth = depth;
    }

    setVisited() {
      this.visited = true;
    }
}

/* Non-recursive Depth-First Search approach.
 * It is messy as it needs to reinsert the <DL>, <DT>
 * and <p> tags back into the structure.
 */
export function exportHTML(bookmarkData) {
  let text = "" + HTML_HEADER;
  const stack = [];
  stack.push(new BookmarkStackFrame(bookmarkData, false, 0));

  while (stack.length > 0) {
    let top = stack.pop();
    let indent = "    ".repeat(top.depth);
    let string = "" + indent;

    if (!top.visited) {
      if (top.depth > 0) {
        string += "<DT>"
      }
      string += top.node.toHTMLString() + '\n'; 
      if (HEADER_TAGS.has(top.node.tag)) {
        string += indent + "<DL><p>\n";
        top.setVisited();
        stack.push(top);
        for (const el of top.node.children.toReversed()) { /* Reverse on push, correct order on pop */
          stack.push(new BookmarkStackFrame(el, false, top.depth + 1));
        }
      }
    } else {
      string += "</DL><p>\n";
    }
    text += string;
  }
  exportData(text, "text/html", "bookmarkcfg-out.html");
}
