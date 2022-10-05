import { getCursorPosition, Grid } from "./colorful-canvas.js";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const box = document.getElementById("box") as HTMLDivElement;
const container = document.getElementById("container") as HTMLDivElement;

let [rows, columns] = [20, 35];
let gridObj = new Grid(canvas, rows, columns);

canvas.onclick = (e) => {
    console.log(e.buttons);
    let [x, y] = getCursorPosition(e, canvas);
    gridObj.markRect(x, y, true);
};

canvas.onmousemove = (e) => {
    if (e.buttons !== 0) {
        let [x, y] = getCursorPosition(e, canvas);
        gridObj.markRect(x, y, true);
    }
};

const rectLen = gridObj.rectLen;
const [left, top] = wrapCoords((3 * rectLen) / 2, (3 * rectLen) / 2)!;

box.style.left = left + "px";
box.style.top = top + "px";
let mX: number, mY: number, oldLeft: number, oldTop: number;
let move = false;
box.onmousedown = (e) => {
    mX = e.clientX;
    mY = e.clientY;
    oldLeft = parseInt(box.style.left.split("px")[0]);
    oldTop = parseInt(box.style.top.split("px")[0]);
    move = true;
};
box.onmouseup = (e) => {
    if (move) {
        const [newLeft, newTop] = wrapCoords(parseInt(box.style.left.split("px")[0]), parseInt(box.style.top.split("px")[0]))!;
        box.style.left = newLeft + "px";
        box.style.top = newTop + "px";
    }
    move = false;
};
box.onmousemove = (e) => {
    if (e.buttons !== 0 && move) {
        const diffX = e.clientX - mX;
        const diffY = e.clientY - mY;
        const newLeft = oldLeft + diffX;
        const newTop = oldTop + diffY;
        if (newLeft < 0)
            box.style.left = "0px";
        else if (newLeft > container.clientWidth - box.clientWidth)
            box.style.left = container.clientWidth - box.clientWidth + "px";
        else
            box.style.left = newLeft + "px";
        if (newTop < 0)
            box.style.top = "0px";
        else if (newTop > container.clientHeight - box.clientHeight)
            box.style.top = container.clientHeight - box.clientHeight + "px";
        else
            box.style.top = newTop + "px";
    }
};
function wrapCoords(x: number, y: number) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const rectX = (c * rectLen) / 2;
            const rectY = (r * rectLen) / (2 - gridObj.offsetHeight);
            if (x > rectX + rectLen) continue;
            if (x < rectX) continue;
            if (y > rectY + rectLen) continue;
            if (y < rectY) continue;
            return [rectX + rectLen / 2 - 1, rectY + rectLen / 2 - 1];
        }
    }
}

