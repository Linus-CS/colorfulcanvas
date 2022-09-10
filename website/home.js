const canvas = document.getElementById("canvas");
const box = document.getElementById("box");
const container = document.getElementById("container");

let grid = {};
let [columns, rows] = [35, 20];

/** Increase resolution */
canvas.width = canvas.clientWidth * 2;
canvas.height = canvas.clientHeight * 2;

let rect_len = canvas.width / 35;

const ctx = canvas.getContext("2d");
ctx.lineWidth = 5;
ctx.strokeStyle = "black";

function initGrid() {
  grid.rows = {};
  for (let r = 0; r < rows; r++) {
    grid.rows[r] = {};
    grid.rows[r].columns = {};
    for (let c = 0; c < columns; c++) {
      grid.rows[r].columns[c] = { color: "white" };
    }
  }
}

function getCursorPosition(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return [x * 2, y * 2];
}

canvas.onclick = (e) => {
  let [x, y] = getCursorPosition(e);
  markRect(x, y);
  render();
};

canvas.onmousemove = (e) => {
  if (e.buttons !== 0) {
    let [x, y] = getCursorPosition(e);
    markRect(x, y);
    render();
  }
};

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function rect(x, y, w, h) {
  ctx.strokeRect(x, y, w, h);
}

function fillRect(x, y, w, h) {
  ctx.fillRect(x, y, w + 1, h + 1);
}

function markRect(x, y) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const rect_x = c * rect_len;
      const rect_y = r * rect_len;
      if (
        x < rect_x + rect_len &&
        y < rect_y + rect_len &&
        x >= rect_x &&
        y >= rect_y
      ) {
        grid.rows[r].columns[c].color = "black";
        setTimeout(() => {
          grid.rows[r].columns[c].color = "white";
          render();
        }, 3000);
      }
    }
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const rect_x = c * rect_len;
      const rect_y = r * rect_len;
      ctx.fillStyle = grid.rows[r].columns[c].color;
      fillRect(rect_x, rect_y, rect_len, rect_len);
      rect(rect_x, rect_y, rect_len, rect_len);
    }
  }
}

initGrid();
render();
const [new_l, new_t] = wrapCoords((3 * rect_len) / 2, (3 * rect_len) / 2);
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
    const [new_left, new_top] = wrapCoords(
      parseInt(box.style.left.split("px")[0]),
      parseInt(box.style.top.split("px")[0])
    );

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

    if (new_left < 0) box.style.left = "0px";
    else if (new_left > container.clientWidth - box.clientWidth)
      box.style.left = container.clientWidth - box.clientWidth + "px";
    else box.style.left = new_left + "px";

    if (new_top < 0) box.style.top = "0px";
    else if (new_top > container.clientHeight - box.clientHeight)
      box.style.top = container.clientHeight - box.clientHeight + "px";
    else box.style.top = new_top + "px";
  }
};

function wrapCoords(x, y) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const rect_x = (c * rect_len) / 2;
      const rect_y = (r * rect_len) / 2;
      if (
        x < rect_x + rect_len &&
        y < rect_y + rect_len &&
        x >= rect_x &&
        y >= rect_y
      ) {
        return [rect_x + rect_len / 2, rect_y + rect_len / 2];
      }
    }
  }
}
