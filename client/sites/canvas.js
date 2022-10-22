import { getCursorPosition, Grid } from "./colorful-canvas.js";
const range = document.getElementById("range");
const toggle = document.getElementById("toggle");
const canvas = document.getElementById("canvas");
const grid_colors = document.getElementById("grid-colors");
const colors = document.getElementById("colors");
const exportButton = document.getElementById("export");
const saveButton = document.getElementById("save");
let [rows, columns] = [range.valueAsNumber * 13, range.valueAsNumber * 9];
const gridObj = new Grid(canvas, rows, columns);
range.oninput = () => {
    [rows, columns] = [range.valueAsNumber * 13, range.valueAsNumber * 9];
    gridObj.size = { rows, columns };
};
toggle.onchange = () => {
    gridObj.outline = toggle.checked;
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
saveButton.onclick = () => {
    fetch("/save", { method: "post", body: gridObj.toJson() }).then((res) => {
        console.log("Status of save: " + res.status);
    });
};
function addChildrenOnClick(obj, func) {
    for (const element of obj.childNodes) {
        let asDiv = element;
        if ("style" in element) {
            asDiv.onclick = () => {
                func(asDiv);
            };
        }
    }
}
let last_choosen;
addChildrenOnClick(grid_colors, (element) => {
    canvas.style.borderColor = element.style.backgroundColor;
    if (last_choosen)
        last_choosen.style.borderColor = "black";
    last_choosen = element;
    element.style.borderColor = "white";
    gridObj.color = element.style.backgroundColor;
});
let last_selected;
addChildrenOnClick(colors, (element) => {
    if (last_selected)
        last_selected.style.borderColor = "black";
    last_selected = element;
    element.style.borderColor = "white";
    gridObj.selectedColor = element.style.backgroundColor;
});
//# sourceMappingURL=canvas.js.map