var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Grid, randomColor } from "./colorful-canvas.js";
const artworks = document.getElementsByClassName("artwork");
const grids = [];
for (const artwork of artworks) {
    grids.push(new Grid(artwork, 13, 9));
}
function setGridsWithRandomColor() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const grid of grids) {
            for (let row = 0; row < grid.size.rows; row++) {
                for (let column = 0; column < grid.size.columns; column++) {
                    grid.selectedColor = randomColor();
                    grid.setRect(row, column);
                }
            }
        }
    });
}
setGridsWithRandomColor();
//# sourceMappingURL=artworks.js.map