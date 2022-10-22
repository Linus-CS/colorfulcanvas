type RectFunc = (row: number, column: number, rect_x: number, rect_y: number) => void;

const OFFSET_CONST = 1.7778;
const LINE_CONST = 0.05625;

export class Grid {
  private canvas: HTMLCanvasElement;
  private grid: Map<number, Map<number, string>> = new Map();
  private ctx: CanvasRenderingContext2D;

  public selectedColor: string;

  private _rectLen: number;
  private _offsetHeight: number;
  private _color: string;
  private _outline: boolean;
  private _size: { rows: number, columns: number };

  constructor(canvas: HTMLCanvasElement, rows: number, columns: number) {
    this.grid = new Map();
    this.canvas = canvas;

    /* Increase resolution for higher quality image */
    this._offsetHeight = OFFSET_CONST - (screen.width / screen.height);
    this.canvas.width = canvas.clientWidth * 2;
    this.canvas.height = canvas.clientHeight * (2 - this._offsetHeight);

    this.ctx = canvas.getContext("2d")!;
    this._rectLen = this.canvas.width / columns;
    this.selectedColor = "black";
    this._color = "black";
    this._outline = true;
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
    this.ctx.lineWidth = LINE_CONST * this._rectLen;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.applyToRects((row, column, rect_x, rect_y) => {
      this.ctx.fillStyle = this.grid.get(row)?.get(column)!;
      this.ctx.fillRect(rect_x, rect_y, this._rectLen + 1, this._rectLen + 1);
      if (this._outline)
        this.ctx.strokeRect(rect_x, rect_y, this._rectLen, this._rectLen);
    });
  }

  public markRect(x: number, y: number, unmark = false) {
    this.applyToRects((row, column, rect_x, rect_y) => {
      if (x > rect_x + this._rectLen) return;
      if (x < rect_x) return;
      if (y > rect_y + this._rectLen) return;
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

  public setRect(row: number, column: number, unmark = false) {
    this.grid.get(row)?.set(column, this.selectedColor);
    this.render();
    if (unmark) {
      setTimeout(() => {
        this.grid.get(row)?.set(column, "white");
        this.render();
      }, 3000);
    }

  }

  private applyToRects(func: RectFunc) {
    for (let r = 0; r < this._size.rows; r++) {
      for (let c = 0; c < this._size.columns; c++) {
        const rect_x = c * this._rectLen;
        const rect_y = r * this._rectLen;
        func(r, c, rect_x, rect_y);
      }
    }
  }

  public set size(new_size) {
    this._rectLen = this.canvas.width / new_size.columns;
    this._size = new_size;
    this.setGrid();
    this.render();
  }

  public get size() {
    return this._size;
  }

  public set outline(value) {
    this._outline = value;
    this.render();
  }

  public get outline() {
    return this._outline;
  }

  public set color(value) {
    this._color = value;
    this.render();
  }

  public get color() {
    return this._color;
  }

  public get rectLen() {
    return this._rectLen;
  }

  public get offsetHeight() {
    return this._offsetHeight;
  }

  public toJson() {
    const tmp = Array.from(this.grid.values());
    const gridData = tmp.map((value) => Array.from(value.values()));
    const data = { grid: gridData, size: this._size, outline: this._outline, color: this._color };
    return JSON.stringify(data);
  }
}
export function getCursorPosition(event: MouseEvent, canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  let offsetHeight = 1.7778 - (screen.width / screen.height);
  return [x * 2, y * (2 - offsetHeight)];
}

export function randomColor() {
  return `#${Math.floor(Math.random() * 0xffffff).toString(16)}`;
}
