export const DATE_ISO_STR_LIMIT = 19; // Used to trim out milliseconds and 'Z' in ISO strings
export const MILLISECONDS_IN_SECOND = 1000;
export const MINUTES_IN_MILLISECONDS = 60 * MILLISECONDS_IN_SECOND;

function timestampToDate(timestamp) {
    if (!timestamp) {
        timestamp = "0";
    }
    const ms = Number(timestamp) * MILLISECONDS_IN_SECOND;
    return new Date(ms);
}

export function timestampToLocalDate(timestamp) {
    const date = timestampToDate(timestamp);
    const localMS =
        date.getTime() - date.getTimezoneOffset() * MINUTES_IN_MILLISECONDS;
    return new Date(localMS);
}

export function dateToSecTimestamp(dateStr) {
    const date = new Date(dateStr);
    const sec = date.getTime() / MILLISECONDS_IN_SECOND;
    return Math.floor(sec);
}

export function timeNowSeconds() {
    return Math.floor(Date.now() / MILLISECONDS_IN_SECOND);
}
