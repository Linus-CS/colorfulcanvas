import { Grid, randomColor } from "./colorful-canvas.js";

const artworks: HTMLCollectionOf<HTMLCanvasElement> = document.getElementsByClassName("artwork") as HTMLCollectionOf<HTMLCanvasElement>;

const grids: Grid[] = [];

for (const artwork of artworks) {
    grids.push(new Grid(artwork, 13, 9));
}

async function setGridsWithRandomColor() {
    for (const grid of grids) {
        for (let row = 0; row < grid.size.rows; row++) {
            for (let column = 0; column < grid.size.columns; column++) {
                grid.selectedColor = randomColor();
                grid.setRect(row, column);
            }
        }
    }
}

setGridsWithRandomColor();