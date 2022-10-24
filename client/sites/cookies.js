export function setCookie(document, cookieName, value) {
    let cookie;
    if ((cookie = getCookie(document, cookieName))) {
        document.cookie = document.cookie.replace(`${cookieName}=${cookie}`, `${cookieName}=${value}`);
        return;
    }
    if (!document.cookie.endsWith(";"))
        document.cookie += ";";
    document.cookie += `${cookieName}=${value};`;
}
export function getCookie(document, cookieName) {
    if (!document.cookie.includes(cookieName))
        return null;
    return document.cookie.split(`${cookieName}=`)[1].split(";")[0];
}
//# sourceMappingURL=cookies.js.map