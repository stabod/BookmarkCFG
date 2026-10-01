export const exampleHTML =
    '<!DOCTYPE NETSCAPE-Bookmark-file-1>\
<!-- This is an automatically generated file.\
     It will be read and overwritten.\
     DO NOT EDIT! -->\
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\
<TITLE>Bookmarks</TITLE>\
<H1>Bookmarks</H1>\
<DL><p>\
    <DT><H3 ADD_DATE="1787572080" LAST_MODIFIED="1788152311" PERSONAL_TOOLBAR_FOLDER="true">Bookmarks bar</H3>\
    <DL><p>\
        <DT><A HREF="https://rechnik.chitanka.info/" ADD_DATE="1787572099">Речник на българския език</A>\
        <DT><A HREF="https://www.merriam-webster.com/" ADD_DATE="1787754154">Merriam-Webster: America&#39;s Most Trusted Dictionary</A>\
        <DT><H3 ADD_DATE="1787572109" LAST_MODIFIED="1787572387">TestFolder</H3>\
        <DL><p>\
            <DT><A HREF="https://www.google.com/" ADD_DATE="1787572385">Google</A>\
        </DL><p>\
    </DL><p>\
</DL><p>\
';

export const exampleInvalidHTML =
    '<!DOCTYPE NETSCAPE-Bookmark-file-1>\
<!-- This is an automatically generated file.\
     It will be read and overwritten.\
     DO NOT EDIT! -->\
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\
<TITLE>Bookmarks</TITLE>\
<H1>Bookmarks</H1>\
<DL><p>\
    <DT><H3 ADD_DATE="1787572080" LAST_MODIFIED="1788152311" PERSONAL_TOOLBAR_FOLDER="true">Bookmarks bar</H3>\
    <DL><p>\
        <DT><A HREF="https://rechnik.chitanka.info/" ADD_DATE="1787572099">Речник на българския език</A>\
        <DT><A HREF="https://www.merriam-webster.com/" ADD_DATE="1787754154">Merriam-Webster: America&#39;s Most Trusted Dictionary</A>\
        <DT><H3 ADD_DATE="1787572109" LAST_MODIFIED="1787572387">TestFolder</H3>\
    </DL><p>\
</DL><p>\
';

export const exampleCorrectObject = {
    id: 1,
    tag: "H1",
    attributes: { add_date: 0, last_modified: 0 },
    text: "Bookmarks",
    children: [
        {
            id: 2,
            tag: "H3",
            attributes: {
                add_date: 1787572080,
                last_modified: 1788152311,
                personal_toolbar_folder: "true",
            },
            text: "Bookmarks bar",
            children: [
                {
                    id: 3,
                    tag: "A",
                    attributes: {
                        add_date: 1787572099,
                        last_modified: 0,
                        href: "https://rechnik.chitanka.info/",
                    },
                    text: "Речник на българския език",
                    children: null,
                },
                {
                    id: 4,
                    tag: "A",
                    attributes: {
                        add_date: 1787754154,
                        last_modified: 0,
                        href: "https://www.merriam-webster.com/",
                    },
                    text: "Merriam-Webster: America's Most Trusted Dictionary",
                    children: null,
                },
                {
                    id: 5,
                    tag: "H3",
                    attributes: {
                        add_date: 1787572109,
                        last_modified: 1787572387,
                    },
                    text: "TestFolder",
                    children: [
                        {
                            id: 6,
                            tag: "A",
                            attributes: {
                                add_date: 1787572385,
                                last_modified: 0,
                                href: "https://www.google.com/",
                            },
                            text: "Google",
                            children: null,
                        },
                    ],
                },
            ],
        },
    ],
};

export const exampleCorrectArray = [
    exampleCorrectObject,
    exampleCorrectObject.children[0],
    exampleCorrectObject.children[0].children[0],
    exampleCorrectObject.children[0].children[1],
    exampleCorrectObject.children[0].children[2],
    exampleCorrectObject.children[0].children[2].children[0],
];

export const exampleCorrectParentMap = new Map([
    [exampleCorrectObject.id, null],
    [exampleCorrectObject.children[0].id, exampleCorrectObject],
    [
        exampleCorrectObject.children[0].children[0].id,
        exampleCorrectObject.children[0],
    ],
    [
        exampleCorrectObject.children[0].children[1].id,
        exampleCorrectObject.children[0],
    ],
    [
        exampleCorrectObject.children[0].children[2].id,
        exampleCorrectObject.children[0],
    ],
    [
        exampleCorrectObject.children[0].children[2].children[0].id,
        exampleCorrectObject.children[0].children[2],
    ],
]);

export const exampleInputAttributes = {
    attributes: [
        { name: "href", value: "https://example.com" },
        { name: "add_date", value: "1787572080" },
    ],
};

export const correctlyParsedAttributes = {
    href: "https://example.com",
    add_date: 1787572080,
    last_modified: 0,
};
