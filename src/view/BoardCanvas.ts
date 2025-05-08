import { Board } from "../model/Board";
import { StoneColor } from "../types/StoneColor";
import { Position } from "../types/Position";

export class BoardCanvas {
  public readonly element: HTMLDivElement;
  public static readonly SIZE = 8;
  private readonly cells: HTMLDivElement[][] = [];
  private readonly onCellClick: (r: number, c: number) => void;
  private readonly highlighted = new Set<string>();// "row,col" 形式で管理

  public constructor(onCellClick: (row: number, col: number) => void) {
    this.onCellClick = onCellClick;

    /* ---------- 盤面 DOM 構築 ---------- */
    this.element = document.createElement("div");
    this.element.classList.add("board-canvas");

    for (let r = 0; r < BoardCanvas.SIZE; r++) {
      const rowEl = document.createElement("div");
      rowEl.classList.add("board-row");
      const rowArr: HTMLDivElement[] = [];

      for (let c = 0; c < BoardCanvas.SIZE; c++) {
        const cellEl = document.createElement("div");
        cellEl.classList.add("board-cell");
        cellEl.dataset.row = String(r);
        cellEl.dataset.col = String(c);
        cellEl.addEventListener("click", this.onClick);

        rowEl.appendChild(cellEl);
        rowArr.push(cellEl);
      }

      this.element.appendChild(rowEl);
      this.cells.push(rowArr);
    }
  }


  private onClick = (ev: MouseEvent): void => {
    const cell = ev.currentTarget as HTMLDivElement;
    const r = Number(cell.dataset.row);
    const c = Number(cell.dataset.col);
    this.onCellClick(r, c);
  };


  public render(board: Board): void {
    for (let r = 0; r < BoardCanvas.SIZE; r++) {
      for (let c = 0; c < BoardCanvas.SIZE; c++) {
        const cell = this.cells[r][c];
        cell.classList.remove("black", "white", "empty");

        const color: StoneColor = board.getCell(r, c);
        switch (color) {
          case StoneColor.BLACK:
            cell.classList.add("black");
            break;
          case StoneColor.WHITE:
            cell.classList.add("white");
            break;
          default:
            cell.classList.add("empty");
        }
      }
    }
  }


  public highlight(valid: Position[]): void {
    /* 旧ハイライト解除 */
    this.highlighted.forEach(key => {
      const [r, c] = key.split(",").map(Number);
      this.cells[r][c].classList.remove("highlight");
    });
    this.highlighted.clear();

    /* 新ハイライト適用 */
    valid.forEach(({ row, col }) => {
      if (row < 0 || row >= BoardCanvas.SIZE || col < 0 || col >= BoardCanvas.SIZE) return;
      this.cells[row][col].classList.add("highlight");
      this.highlighted.add(`${row},${col}`);
    });
  }

}
