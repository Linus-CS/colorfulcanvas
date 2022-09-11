export class Grid {
    constructor(canvas, rows, columns) {
        this.grid = new Map();
        this.grid = new Map();
        this.canvas = canvas;
        this.canvas.width = canvas.clientWidth * 2;
        this.canvas.height = canvas.clientHeight * 2;
        this.ctx = canvas.getContext("2d");
        this.ctx.lineWidth = 5;
        this.rectLen = this.canvas.width / columns;
        this.selectedColor = "black";
        this._color = "black";
        this._outlines = true;
        this._size = { rows, columns };
        this.setGrid();
        this.render();
    }
    setGrid() {
        var _a;
        for (let r = 0; r < this._size.rows; r++) {
            this.grid.set(r, new Map());
            for (let c = 0; c < this._size.columns; c++) {
                (_a = this.grid.get(r)) === null || _a === void 0 ? void 0 : _a.set(c, "white");
            }
        }
    }
    render() {
        this.ctx.strokeStyle = this._color;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.applyToRects((row, column, rect_x, rect_y) => {
            var _a;
            this.ctx.fillStyle = (_a = this.grid.get(row)) === null || _a === void 0 ? void 0 : _a.get(column);
            this.ctx.fillRect(rect_x, rect_y, this.rectLen + 1, this.rectLen + 1);
            if (this._outlines)
                this.ctx.strokeRect(rect_x, rect_y, this.rectLen, this.rectLen);
        });
    }
    markRect(x, y, unmark = false) {
        this.applyToRects((row, column, rect_x, rect_y) => {
            var _a;
            if (x > rect_x + this.rectLen)
                return;
            if (x < rect_x)
                return;
            if (y > rect_y + this.rectLen)
                return;
            if (y < rect_y)
                return;
            (_a = this.grid.get(row)) === null || _a === void 0 ? void 0 : _a.set(column, this.selectedColor);
            this.render();
            if (unmark) {
                setTimeout(() => {
                    var _a;
                    (_a = this.grid.get(row)) === null || _a === void 0 ? void 0 : _a.set(column, "white");
                    this.render();
                }, 3000);
            }
        });
    }
    applyToRects(func) {
        for (let r = 0; r < this._size.rows; r++) {
            for (let c = 0; c < this._size.columns; c++) {
                const rect_x = c * this.rectLen;
                const rect_y = r * this.rectLen;
                func(r, c, rect_x, rect_y);
            }
        }
    }
    set size(new_size) {
        this.rectLen = this.canvas.width / new_size.columns;
        this._size = new_size;
        this.setGrid();
        this.render();
    }
    get size() {
        return this._size;
    }
    set outlines(value) {
        this._outlines = value;
        this.render();
    }
    get outlines() {
        return this._outlines;
    }
    set color(value) {
        this._color = value;
        this.render();
    }
    get color() {
        return this._color;
    }
}
export function getCursorPosition(event, canvas) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return [x * 2, y * 2];
}
export function randomColor() {
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
//# sourceMappingURL=colorful-canvas.js.map