import t from "./translations.json";
const translations = t;
const body = document.body;
const children = body.childNodes;
for (const child of children) {
    const translation = translations[child.innerText];
    console.log(translation);
    if (translation) {
        child.innerText = translation;
    }
}
//# sourceMappingURL=translate.js.map