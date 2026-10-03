const DEFAULT_FILENAME = "bookmarkcfg-out";

function exportData(data, dataType, fileName) {
    const blob = new Blob([data], { type: dataType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
}

function ISONow() {
    const date = new Date();
    return date.toISOString();
}

export function exportHTML(text) {
    const fileName = DEFAULT_FILENAME + "-" + ISONow() + ".html";
    exportData(text, "text/html", fileName);
}

export function exportJSON(text) {
    const fileName = DEFAULT_FILENAME + "-" + ISONow() + ".json";
    exportData(text, "application/json", fileName);
}

export function exportText(text) {
    const filename = DEFAULT_FILENAME + "-" + ISONow() + ".txt";
    exportData(text, "text/plain", filename);
}
