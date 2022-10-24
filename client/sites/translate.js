var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getCookie, setCookie } from "./cookies.js";
const body = document.body;
const children = body.childNodes;
const langSwitch = document.getElementById("lang-element");
var Language;
(function (Language) {
    Language["EN"] = "ENG";
    Language["DE"] = "DE";
})(Language || (Language = {}));
const cookie = getCookie(document, "color-lang");
let language = Language.EN;
if (cookie) {
    changeLanguage(cookie);
}
else {
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
            if (lang === langSwitch.innerText)
                flag = true;
        }
        setCookie(document, "color-lang", Language.EN);
        location.reload();
    };
}
function fetchTranslations() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch("/assets/translations.json");
        if (res.ok) {
            return yield res.json();
        }
        return {};
    });
}
function changeLanguage(lang) {
    langSwitch.innerText = lang;
    language = lang;
    setCookie(document, "color-lang", lang);
}
function translate() {
    return __awaiter(this, void 0, void 0, function* () {
        const translations = yield fetchTranslations();
        translateElement(body, translations);
    });
}
function translateElement(element, translations) {
    if (element.hasChildNodes()) {
        const children = element.childNodes;
        for (const child of children) {
            translateElement(child, translations);
        }
    }
    else {
        if (element.nodeType === 3 && element.nodeValue) {
            const translation = translations[element.nodeValue.trim()];
            if (translation)
                element.nodeValue = translation[language];
        }
    }
}
//# sourceMappingURL=translate.js.map