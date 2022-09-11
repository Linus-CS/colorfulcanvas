import { getCursorPosition, Grid } from "./colorful-canvas.js";

const range = document.getElementById("range") as HTMLInputElement;
const toggle = document.getElementById("toggle") as HTMLInputElement;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const grid_colors = document.getElementById("grid-colors") as HTMLDivElement;
const colors = document.getElementById("colors") as HTMLDivElement;
const exportButton = document.getElementById("export") as HTMLDivElement;

let [rows, columns] = [range.valueAsNumber * 13, range.valueAsNumber * 9];
const gridObj = new Grid(canvas, rows, columns);

range.oninput = () => {
    [rows, columns] = [range.valueAsNumber * 13, range.valueAsNumber * 9];
    gridObj.size = { rows, columns };
};

toggle.onchange = () => {
    gridObj.outlines = toggle.checked;
};

canvas.onclick = (e) => {
    let [x, y] = getCursorPosition(e, canvas);
    gridObj.markRect(x, y);
};

canvas.onmousemove = (e) => {
    if (e.buttons !== 0) {
        let [x, y] = getCursorPosition(e, canvas);
        gridObj.markRect(x, y);
    }
};

exportButton.onclick = (e) => {
    let download = document.createElement("a");
    download.href = canvas.toDataURL("png");
    download.download = "amazingImage.png";
    download.click();
};

type ClickFunc = (element: HTMLDivElement) => void;

function addChildrenOnClick(obj: HTMLDivElement, func: ClickFunc) {
    for (const element of obj.childNodes) {
        let asDiv = element as HTMLDivElement;
        if ("style" in element) {
            asDiv.onclick = () => {
                func(asDiv);
            };
        }
    }
}

let last_choosen: HTMLDivElement;
addChildrenOnClick(grid_colors, (element) => {
    canvas.style.borderColor = element.style.backgroundColor;
    if (last_choosen)
        last_choosen.style.borderColor = "black";
    last_choosen = element;
    element.style.borderColor = "white";
    gridObj.color = element.style.backgroundColor;
});

let last_selected: HTMLDivElement;
addChildrenOnClick(colors, (element) => {
    if (last_selected)
        last_selected.style.borderColor = "black";
    last_selected = element;
    element.style.borderColor = "white";
    gridObj.selectedColor = element.style.backgroundColor;
});
