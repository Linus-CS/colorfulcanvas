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
const artwork_canvases = document.getElementsByClassName("artwork");
const grids = [];
function fetchArtworks() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch("/retrieve");
        const reader = (_a = res.body) === null || _a === void 0 ? void 0 : _a.getReader();
        let data = "";
        while (true) {
            const chunk = yield (reader === null || reader === void 0 ? void 0 : reader.read());
            if (chunk === null || chunk === void 0 ? void 0 : chunk.done) {
                break;
            }
            data += new TextDecoder().decode(chunk === null || chunk === void 0 ? void 0 : chunk.value);
        }
        return JSON.parse(data);
    });
}
function buildArtworks() {
    return __awaiter(this, void 0, void 0, function* () {
        const artwork_objs = yield fetchArtworks();
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
    });
}
buildArtworks();
//# sourceMappingURL=artworks.js.map