const range = document.getElementById("range");
const toggle = document.getElementById("toggle");
const canvas = document.getElementById("canvas");
const grid_colours = document.getElementById("grid-colours");
const colours = document.getElementById("colours");
const export_button = document.getElementById("export");

let [columns, rows] = [range.value * 9, range.value * 13];
let grid = {};
let selected_color = "black";
let grid_color = "black";

function initGrid() {
  grid.outlines = toggle.checked;
  grid.rows = {};
  for (let r = 0; r < rows; r++) {
    grid.rows[r] = {};
    grid.rows[r].columns = {};
    for (let c = 0; c < columns; c++) {
      grid.rows[r].columns[c] = { color: "white" };
    }
  }
}

/** Increase resolution */
canvas.width = canvas.clientWidth * 2;
canvas.height = canvas.clientHeight * 2;
console.log(canvas.width, canvas.height);

let rect_len = canvas.width / columns;

const ctx = canvas.getContext("2d");
ctx.lineWidth = 5;

range.oninput = () => {
  [columns, rows] = [range.value * 9, range.value * 13];
  rect_len = canvas.width / columns;
  initGrid();
  render();
};

toggle.onchange = () => {
  grid.outlines = toggle.checked;
  render();
};

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

export_button.onclick = (e) => {
  let download = document.createElement("a");
  download.href = canvas.toDataURL("png");
  download.download = "amazingImage.png";
  download.click();
};

function getCursorPosition(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return [x * 2, y * 2];
}

function random_colour() {
  const r = Math.round(Math.random() * 255)
    .toString(16)
    .padStart(2, "0");
  const g = Math.round(Math.random() * 255)
    .toString(16)
    .padStart(2, "0");
  const b = Math.round(Math.random() * 255)
    .toString(16)
    .padStart(2, "0");
  return `#${r}${g}${b}`;
}

function start() {
  let last_choosen;
  for (const c of grid_colours.childNodes) {
    if ("style" in c) {
      c.onclick = () => {
        canvas.style.borderColor = c.style.backgroundColor;
        if (last_choosen) last_choosen.style.borderColor = "black";
        last_choosen = c;
        c.style.borderColor = "white";
        grid_color = c.style.backgroundColor;
        render();
      };
    }
  }

  let last_selected;
  for (const c of colours.childNodes) {
    if ("style" in c) {
      c.onclick = () => {
        if (last_selected) last_selected.style.borderColor = "black";
        last_selected = c;
        c.style.borderColor = "white";
        selected_color = c.style.backgroundColor;
      };
    }
  }

  initGrid();
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function rect(x, y, w, h) {
  ctx.strokeRect(x, y, w, h);
}

function fillRect(x, y, w, h) {
  ctx.fillRect(x, y, w + 1, h + 1);
}

function render() {
  ctx.strokeStyle = grid_color;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const rect_x = c * rect_len;
      const rect_y = r * rect_len;
      ctx.fillStyle = grid.rows[r].columns[c].color;
      fillRect(rect_x, rect_y, rect_len, rect_len);
      if (grid.outlines) rect(rect_x, rect_y, rect_len, rect_len);
    }
  }
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
        grid.rows[r].columns[c].color = selected_color;
      }
    }
  }
}

start();
render();
