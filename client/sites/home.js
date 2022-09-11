import { getCursorPosition, Grid } from "./colorful-canvas.js";
const canvas = document.getElementById("canvas");
const box = document.getElementById("box");
const container = document.getElementById("container");
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
const rect_len = canvas.width / columns;
const new_l_t = wrapCoords((3 * rect_len) / 2, (3 * rect_len) / 2);
const new_l = new_l_t[0];
const new_t = new_l_t[1];
box.style.left = new_l + "px";
box.style.top = new_t + "px";
let m_x, m_y, old_left, old_top;
let move = false;
box.onmousedown = (e) => {
    m_x = e.clientX;
    m_y = e.clientY;
    old_left = parseInt(box.style.left.split("px")[0]);
    old_top = parseInt(box.style.top.split("px")[0]);
    move = true;
};
box.onmouseup = (e) => {
    if (move) {
        const new_left_top = wrapCoords(parseInt(box.style.left.split("px")[0]), parseInt(box.style.top.split("px")[0]));
        const new_left = new_left_top[0];
        const new_top = new_left_top[1];
        box.style.left = new_left + "px";
        box.style.top = new_top + "px";
    }
    move = false;
};
box.onmousemove = (e) => {
    if (e.buttons !== 0 && move) {
        const diff_x = e.clientX - m_x;
        const diff_y = e.clientY - m_y;
        const new_left = old_left + diff_x;
        const new_top = old_top + diff_y;
        if (new_left < 0)
            box.style.left = "0px";
        else if (new_left > container.clientWidth - box.clientWidth)
            box.style.left = container.clientWidth - box.clientWidth + "px";
        else
            box.style.left = new_left + "px";
        if (new_top < 0)
            box.style.top = "0px";
        else if (new_top > container.clientHeight - box.clientHeight)
            box.style.top = container.clientHeight - box.clientHeight + "px";
        else
            box.style.top = new_top + "px";
    }
};
function wrapCoords(x, y) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const rect_x = (c * rect_len) / 2;
            const rect_y = (r * rect_len) / 2;
            if (x < rect_x + rect_len &&
                y < rect_y + rect_len &&
                x >= rect_x &&
                y >= rect_y) {
                return [rect_x + rect_len / 2 - 1, rect_y + rect_len / 2 - 1];
            }
        }
    }
}
//# sourceMappingURL=home.js.map