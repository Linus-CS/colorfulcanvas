import { Grid, randomColor } from "./colorful-canvas.js";

const artwork_canvases: HTMLCollectionOf<HTMLCanvasElement> = document.getElementsByClassName("artwork") as HTMLCollectionOf<HTMLCanvasElement>;

const grids: Grid[] = [];

buildArtworks();

async function fetchArtworks() {
    const res = await fetch("/retrieve")
    if (res.ok) {
        return await res.json();
    }
    return {};
}

async function buildArtworks() {
    const artwork_objs = await fetchArtworks();

    let cnt = 0;
    for (const obj of artwork_objs) {
        const grid = Grid.fromObj(artwork_canvases[cnt++], obj);
    }

    for (let i = artwork_objs.length; i < 9; i++) {
        const grid = new Grid(artwork_canvases[i], 13, 9);
        for (let row = 0; row < grid.size.rows; row++) {
            for (let column = 0; column < grid.size.columns; column++) {
                grid.selectedColor = randomColor();
                grid.setRect(row, column);
            }
        }
        grids.push(grid);
    }
}

