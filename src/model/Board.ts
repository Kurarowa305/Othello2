import { StoneColor } from "../types/StoneColor";
import { Position }   from "../types/Position";

export class Board {
  public static readonly SIZE = 8; 
  private readonly cells: StoneColor[][];


  public constructor(src?: StoneColor[][]) {
    if (src) {
      // 仮実装（機能追加：CPU思考、リプレイ機能）
      this.cells = src.map(row => row.slice());
      return;
    }

    this.cells = Array.from({ length: Board.SIZE }, () =>
      Array.from<StoneColor>({ length: Board.SIZE }).fill(StoneColor.EMPTY),
    );
    const mid = Board.SIZE / 2;
    this.cells[mid - 1][mid - 1] = StoneColor.WHITE;
    this.cells[mid][mid]         = StoneColor.WHITE;
    this.cells[mid - 1][mid]     = StoneColor.BLACK;
    this.cells[mid][mid - 1]     = StoneColor.BLACK;
  }


  public canPutStone(r: number, c: number, currentPlayer: StoneColor): boolean {
    if (!this.isInBoard(r, c) || this.cells[r][c] !== StoneColor.EMPTY) return false;
    return this.getReverseStones(r, c, currentPlayer).length > 0;
  }


  public getReverseStones(r: number, c: number, currentPlayer: StoneColor): Position[] {
    if (!this.isInBoard(r, c) || this.cells[r][c] !== StoneColor.EMPTY) return [];

    const result: Position[] = [];
    const opponent = currentPlayer === StoneColor.BLACK ? StoneColor.WHITE : StoneColor.BLACK;

    for (const [dr, dc] of Board.DIRECTIONS) {
      const tmp: Position[] = [];
      let cr = r + dr;
      let cc = c + dc;

      // 相手石が続く限り tmp に追加
      while (this.isInBoard(cr, cc) && this.cells[cr][cc] === opponent) {
        tmp.push({ row: cr, col: cc });
        cr += dr;
        cc += dc;
      }

      // 相手石を挟んでいるか判定
      if (
        tmp.length > 0 &&
        this.isInBoard(cr, cc) &&
        this.cells[cr][cc] === currentPlayer
      ) {
        result.push(...tmp);
      }
    }

    return result;
  }


  public applyMove(r: number, c: number, currentPlayer: StoneColor): void {
    const reverses = this.getReverseStones(r, c, currentPlayer);
    if (reverses.length === 0) return;  

    this.cells[r][c] = currentPlayer;
    reverses.forEach(pos => {
      this.cells[pos.row][pos.col] = currentPlayer;
    });
  }


  public getCell(r: number, c: number): StoneColor {
    return this.isInBoard(r, c) ? this.cells[r][c] : StoneColor.EMPTY;
  }


  public clone(): Board {
    return new Board(this.cells);
  }


  private isInBoard(r: number, c: number): boolean {
    return r >= 0 && r < Board.SIZE && c >= 0 && c < Board.SIZE;
  }

  
  /** 8 方向ベクトル */
  private static readonly DIRECTIONS: ReadonlyArray<readonly [number, number]> = [
    [-1, -1], [-1, 0], [-1, 1],
    [ 0, -1],          [ 0, 1],
    [ 1, -1], [ 1, 0], [ 1, 1],
  ];
}
