/* --------------------------------------------------
 * /src/model/Board.ts
 * --------------------------------------------------
 * 盤面状態を保持し、着手可否判定・石の反転など
 * オセロの純粋ロジックのみを提供するクラス。
 * 他クラスからは不変参照だけを返し、副作用は
 * applyMove(...) 経由でのみ発生させる。
 * -------------------------------------------------- */

import { StoneColor } from "../types/StoneColor";
import { Position }   from "../types/Position";

export class Board {
  /* ==============================  定数／フィールド  ============================== */

  public static readonly SIZE = 8;                         // 8×8 固定
  /** 盤面セル [row][col]  */
  private readonly cells: StoneColor[][];

  /* ==============================  初期化  ============================== */

  public constructor(src?: StoneColor[][]) {
    if (src) {
      // ディープコピー用コンストラクタ
      this.cells = src.map(row => row.slice());
      return;
    }

    // 初期配置
    this.cells = Array.from({ length: Board.SIZE }, () =>
      Array.from<StoneColor>({ length: Board.SIZE }).fill(StoneColor.EMPTY),
    );
    const mid = Board.SIZE / 2;
    this.cells[mid - 1][mid - 1] = StoneColor.WHITE;
    this.cells[mid][mid]         = StoneColor.WHITE;
    this.cells[mid - 1][mid]     = StoneColor.BLACK;
    this.cells[mid][mid - 1]     = StoneColor.BLACK;
  }

  /* ==============================  Public API  ============================== */

  /**
   * 指定座標に石を置けるか判定（合法手?）
   */
  public canPutStone(r: number, c: number, color: StoneColor): boolean {
    if (!this.isInBoard(r, c) || this.cells[r][c] !== StoneColor.EMPTY) return false;
    return this.getReverseStones(r, c, color).length > 0;
  }

  /**
   * 石を置いた際に裏返る座標配列を返す。
   * 非合法手の場合は空配列。
   */
  public getReverseStones(r: number, c: number, color: StoneColor): Position[] {
    if (!this.isInBoard(r, c) || this.cells[r][c] !== StoneColor.EMPTY) return [];

    const result: Position[] = [];
    const opponent = color === StoneColor.BLACK ? StoneColor.WHITE : StoneColor.BLACK;

    for (const [dr, dc] of Board.DIRECTIONS) {
      const tmp: Position[] = [];
      let cr = r + dr;
      let cc = c + dc;

      while (this.isInBoard(cr, cc) && this.cells[cr][cc] === opponent) {
        tmp.push({ row: cr, col: cc });
        cr += dr;
        cc += dc;
      }

      if (
        tmp.length > 0 &&
        this.isInBoard(cr, cc) &&
        this.cells[cr][cc] === color
      ) {
        result.push(...tmp);                // 挟まれているので裏返し対象
      }
    }

    return result;
  }

  /**
   * 着手を適用（石設置＋裏返し）。  
   * 合法手以外では何もしない。
   */
  public applyMove(r: number, c: number, color: StoneColor): void {
    const reverses = this.getReverseStones(r, c, color);
    if (reverses.length === 0) return;      // 非合法

    this.cells[r][c] = color;
    reverses.forEach(pos => {
      this.cells[pos.row][pos.col] = color;
    });
  }

  /**
   * セルの内容を取得（範囲外アクセスは StoneColor.EMPTY 扱い）
   */
  public getCell(r: number, c: number): StoneColor {
    return this.isInBoard(r, c) ? this.cells[r][c] : StoneColor.EMPTY;
  }

  /**
   * 盤面をディープコピーして返す  
   * これにより View 側からの書き換えを防止
   */
  public clone(): Board {
    return new Board(this.cells);
  }

  /* ==============================  内部ユーティリティ  ============================== */

  /** 盤面内かどうか */
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
