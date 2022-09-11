/* All html elements */
const range = document.getElementById("range");
const toggle = document.getElementById("toggle");
const canvas = document.getElementById("canvas");
const grid_colors = document.getElementById("grid-colors");
const colors = document.getElementById("colors");
const export_button = document.getElementById("export");

/* Calculate number of columns and rows to fit on canvas */
let [columns, rows] = [range.value * 9, range.value * 13];

/* Increase canvas resolution for sharper image */
canvas.width = canvas.clientWidth * 2;
canvas.height = canvas.clientHeight * 2;

/* Context used to draw on canvas */
ctx = canvas.getContext("2d");
ctx.lineWidth = 5;

/* Initilize grid obj to draw on canvas element */
let grid = init_grid(canvas, "black", "black");

function init_grid(canvas, color, selected_color) {
  let grid = {};

  /* color that is used for outlines and border of canvas */
  grid.color = color;
  /* color that is used to draw on canvas */
  grid.selected_color = selected_color;

  grid.rect_len = canvas.width / columns;
  grid.outlines = toggle.checked;

  grid.rows = {};
  for (let r = 0; r < rows; r++) {
    grid.rows[r] = {};
    grid.rows[r].columns = {};
    for (let c = 0; c < columns; c++) {
      grid.rows[r].columns[c] = { color: "white" };
    }
  }
  return grid;
}

range.oninput = () => {
  [columns, rows] = [range.value * 9, range.value * 13];
  grid = init_grid(canvas, grid.color, grid.selected_color);
  render();
};

toggle.onchange = () => {
  grid.outlines = toggle.checked;
  render();
};

canvas.onclick = (e) => {
  console.log(e.buttons);
  let [x, y] = getCursorPosition(e);
  mark_rect(x, y);
  render();
};

canvas.onmousemove = (e) => {
  if (e.buttons !== 0) {
    let [x, y] = getCursorPosition(e);
    mark_rect(x, y);
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

function random_color() {
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

function add_color_functionality(grid) {
  let last_choosen;
  add_children_onclick(grid_colors, (element) => {
    canvas.style.borderColor = element.style.backgroundColor;
    if (last_choosen) last_choosen.style.borderColor = "black";
    last_choosen = element;
    element.style.borderColor = "white";
    grid.color = element.style.backgroundColor;
    render();
  });

  let last_selected;
  add_children_onclick(colors, (element) => {
    if (last_selected) last_selected.style.borderColor = "black";
    last_selected = element;
    element.style.borderColor = "white";
    grid.selected_color = element.style.backgroundColor;
  });
}

function add_children_onclick(obj, onclick) {
  for (const element of obj.childNodes) {
    if ("style" in element) {
      element.onclick = () => {
        onclick(element);
      };
    }
  }
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

function render(grid) {
  ctx.strokeStyle = grid.color;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const rect_x = c * grid.rect_len;
      const rect_y = r * grid.rect_len;
      ctx.fillStyle = grid.rows[r].columns[c].color;
      fillRect(rect_x, rect_y, grid.rect_len, grid.rect_len);
      if (grid.outlines) rect(rect_x, rect_y, grid.rect_len, grid.rect_len);
    }
  }
}

function mark_rect(x, y) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const rect_x = c * grid.rect_len;
      const rect_y = r * grid.rect_len;
      if (
        x - 10 < rect_x + grid.rect_len &&
        y < rect_y + grid.rect_len &&
        x - 10 >= rect_x &&
        y >= rect_y
      ) {
        grid.rows[r].columns[c].color = grid.selected_color;
      }
    }
  }
}

add_color_functionality();
render();

export { random_color };
