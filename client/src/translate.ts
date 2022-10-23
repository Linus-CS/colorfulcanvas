
import t from "./translations.json";
const translations = t as any;

const body = document.body;
const children: NodeListOf<HTMLElement> = body.childNodes as NodeListOf<HTMLElement>;

for (const child of children) {
    const translation = translations[child.innerText];
    console.log(translation);
    if (translation) {
        child.innerText = translation;
    }
}




