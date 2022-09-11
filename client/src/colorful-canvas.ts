type RectFunc = (row: number, column: number, rect_x: number, rect_y: number) => void;

export class Grid {
  private canvas: HTMLCanvasElement;
  private grid: Map<number, Map<number, string>> = new Map();
  private ctx: CanvasRenderingContext2D;
  private rectLen: number;

  public selectedColor: string;

  private _color: string;
  private _outlines: boolean;
  private _size: { rows: number, columns: number };

  constructor(canvas: HTMLCanvasElement, rows: number, columns: number) {
    this.grid = new Map();
    this.canvas = canvas;
    this.canvas.width = canvas.clientWidth * 2;
    this.canvas.height = canvas.clientHeight * 2;
    this.ctx = canvas.getContext("2d")!;
    this.ctx.lineWidth = 5;
    this.rectLen = this.canvas.width / columns;
    this.selectedColor = "black";
    this._color = "black";
    this._outlines = true;
    this._size = { rows, columns };
    this.setGrid();
    this.render();
  }

  private setGrid() {
    for (let r = 0; r < this._size.rows; r++) {
      this.grid.set(r, new Map());
      for (let c = 0; c < this._size.columns; c++) {
        this.grid.get(r)?.set(c, "white");
      }
    }
  }

  private render() {
    this.ctx.strokeStyle = this._color;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.applyToRects((row, column, rect_x, rect_y) => {
      this.ctx.fillStyle = this.grid.get(row)?.get(column)!;
      this.ctx.fillRect(rect_x, rect_y, this.rectLen + 1, this.rectLen + 1);
      if (this._outlines)
        this.ctx.strokeRect(rect_x, rect_y, this.rectLen, this.rectLen);
    });
  }

  public markRect(x: number, y: number, unmark = false) {
    this.applyToRects((row, column, rect_x, rect_y) => {
      if (x > rect_x + this.rectLen) return;
      if (x < rect_x) return;
      if (y > rect_y + this.rectLen) return;
      if (y < rect_y) return;
      this.grid.get(row)?.set(column, this.selectedColor);
      this.render();
      if (unmark) {
        setTimeout(() => {
          this.grid.get(row)?.set(column, "white");
          this.render();
        }, 3000);
      }
    });
  }

  private applyToRects(func: RectFunc) {
    for (let r = 0; r < this._size.rows; r++) {
      for (let c = 0; c < this._size.columns; c++) {
        const rect_x = c * this.rectLen;
        const rect_y = r * this.rectLen;
        func(r, c, rect_x, rect_y);
      }
    }
  }

  public set size(new_size) {
    this.rectLen = this.canvas.width / new_size.columns;
    this._size = new_size;
    this.setGrid();
    this.render();
  }

  public get size() {
    return this._size;
  }

  public set outlines(value) {
    this._outlines = value;
    this.render();
  }

  public get outlines() {
    return this._outlines;
  }

  public set color(value) {
    this._color = value;
    this.render();
  }

  public get color() {
    return this._color;
  }
}
export function getCursorPosition(event: MouseEvent, canvas: HTMLCanvasElement) {
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
