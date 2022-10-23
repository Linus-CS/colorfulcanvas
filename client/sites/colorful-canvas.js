const OFFSET_CONST = 1.7778;
const LINE_CONST = 0.05625;
export class Grid {
    constructor(canvas, rows, columns) {
        this.grid = new Map();
        this.grid = new Map();
        this.canvas = canvas;
        this._offsetHeight = OFFSET_CONST - (screen.width / screen.height);
        this.canvas.width = canvas.clientWidth * 2;
        this.canvas.height = canvas.clientHeight * (2 - this._offsetHeight);
        this.ctx = canvas.getContext("2d");
        this._rectLen = this.canvas.width / columns;
        this.selectedColor = "black";
        this._color = "black";
        this._outline = true;
        this._size = { rows, columns };
        this.setGrid();
        this.render();
    }
    static fromObj(canvas, obj) {
        const grid = new Grid(canvas, obj.size.rows, obj.size.columns);
        grid._color = obj.color;
        grid._outline = obj.outline;
        grid.grid = new Map(obj.grid.map((row, id_r) => {
            return [id_r, new Map(row.map((color, id_c) => {
                    return [id_c, color];
                }))];
        }));
        grid.render();
        return grid;
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
        this.ctx.lineWidth = LINE_CONST * this._rectLen;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.applyToRects((row, column, rect_x, rect_y) => {
            var _a;
            this.ctx.fillStyle = (_a = this.grid.get(row)) === null || _a === void 0 ? void 0 : _a.get(column);
            this.ctx.fillRect(rect_x, rect_y, this._rectLen + 1, this._rectLen + 1);
            if (this._outline)
                this.ctx.strokeRect(rect_x, rect_y, this._rectLen, this._rectLen);
        });
    }
    markRect(x, y, unmark = false) {
        this.applyToRects((row, column, rect_x, rect_y) => {
            var _a;
            if (x > rect_x + this._rectLen)
                return;
            if (x < rect_x)
                return;
            if (y > rect_y + this._rectLen)
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
    setRect(row, column, unmark = false) {
        var _a;
        (_a = this.grid.get(row)) === null || _a === void 0 ? void 0 : _a.set(column, this.selectedColor);
        this.render();
        if (unmark) {
            setTimeout(() => {
                var _a;
                (_a = this.grid.get(row)) === null || _a === void 0 ? void 0 : _a.set(column, "white");
                this.render();
            }, 3000);
        }
    }
    applyToRects(func) {
        for (let r = 0; r < this._size.rows; r++) {
            for (let c = 0; c < this._size.columns; c++) {
                const rect_x = c * this._rectLen;
                const rect_y = r * this._rectLen;
                func(r, c, rect_x, rect_y);
            }
        }
    }
    set size(new_size) {
        this._rectLen = this.canvas.width / new_size.columns;
        this._size = new_size;
        this.setGrid();
        this.render();
    }
    get size() {
        return this._size;
    }
    set outline(value) {
        this._outline = value;
        this.render();
    }
    get outline() {
        return this._outline;
    }
    set color(value) {
        this._color = value;
        this.render();
    }
    get color() {
        return this._color;
    }
    get rectLen() {
        return this._rectLen;
    }
    get offsetHeight() {
        return this._offsetHeight;
    }
    toJson() {
        const tmp = Array.from(this.grid.values());
        const gridData = tmp.map((value) => Array.from(value.values()));
        const data = { grid: gridData, size: this._size, outline: this._outline, color: this._color };
        return JSON.stringify(data);
    }
}
export function getCursorPosition(event, canvas) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    let offsetHeight = 1.7778 - (screen.width / screen.height);
    return [x * 2, y * (2 - offsetHeight)];
}
export function randomColor() {
    return `#${Math.floor(Math.random() * 0xffffff).toString(16)}`;
}
//# sourceMappingURL=colorful-canvas.js.map