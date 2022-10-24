import { getCookie, setCookie } from "./cookies.js";

const body = document.body;
const children: NodeListOf<HTMLElement> = body.childNodes as NodeListOf<HTMLElement>;
const langSwitch = document.getElementById("lang-element") as HTMLAnchorElement;

enum Language {
    EN = "ENG", DE = "DE"
}

const cookie = getCookie(document, "color-lang");
let language: Language = Language.EN;

if (cookie) {
    changeLanguage(cookie as Language);
} else {
    setCookie(document, "color-lang", language);
}

if (language !== Language.EN)
    translate();

if (langSwitch) {
    langSwitch.onclick = _ => {
        let flag = false;
        for (const lang of Object.values(Language)) {
            if (flag) {
                changeLanguage(lang);
                translate();
                return;
            }
            if (lang === langSwitch.innerText) flag = true;
        }
        setCookie(document, "color-lang", Language.EN);
        location.reload();
    }
}

async function fetchTranslations() {
    const res = await fetch("/assets/translations.json")
    if (res.ok) {
        return await res.json();
    }
    return {};
}

function changeLanguage(lang: Language) {
    langSwitch.innerText = lang;
    language = lang;
    setCookie(document, "color-lang", lang);
}

async function translate() {
    const translations = await fetchTranslations();
    translateElement(body, translations);
}

function translateElement(element: HTMLElement, translations: any) {
    if (element.hasChildNodes()) {
        const children: NodeListOf<HTMLElement> = element.childNodes as NodeListOf<HTMLElement>;
        for (const child of children) {
            translateElement(child, translations);
        }
    } else {
        if (element.nodeType === 3 && element.nodeValue) {
            const translation = translations[element.nodeValue.trim()];
            if (translation)
                element.nodeValue = translation[language];
        }
    }
}


