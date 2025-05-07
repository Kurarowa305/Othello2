import { StoneColor } from "../types/StoneColor";
import { Position } from "../types/Position";
import { Board } from "../model/Board";
import { OthelloGame } from "../model/OthelloGame";
import { IPlayer } from "./IPlayer";

/**
 * HumanPlayer
 * --------------------------------------------------
 * ① GameView(BoardCanvas) からセルクリック通知を受ける  
 * ② その座標が合法手かモデルに再確認  
 * ③ 合法なら OthelloGame#putStone() を呼び出し、ゲームを進行  
 *
 * UI 由来の非同期入力を扱うため、IPlayer#chooseMove では
 * 実際の手は返さず `null` を返す実装にしています。
 */
export class HumanPlayer implements IPlayer {
  /** プレイヤーの石色 (BLACK / WHITE) */
  public readonly color: StoneColor;

  /** 操作対象のゲームインスタンス ― OthelloGame から動的に紐付ける */
  private game?: OthelloGame;

  public constructor(color: StoneColor) {
    this.color = color;
  }

  /* --------------------------------------------------
   * IPlayer 実装
   * -------------------------------------------------- */

  /** Human はクリック入力で手を確定させるため、ここでは常に `null` を返す */
  public chooseMove(_: Board): Position | null {
    return null;
  }

  /* --------------------------------------------------
   * ゲームとの連携
   * -------------------------------------------------- */

  /**
   * OthelloGame 側でプレイヤーを登録した直後に呼び出してもらう想定。
   * これにより HumanPlayer からモデル操作が可能になる。
   */
  public bindGame(game: OthelloGame): void {
    this.game = game;
  }

  /* --------------------------------------------------
   * UI からの入力ハンドラ
   * -------------------------------------------------- */

  /**
   * BoardCanvas → GameView を経由して通知されるクリックイベント。
   * 合法手かどうかを再検証し、OK ならモデルに着手を依頼する。
   */
  public onCellClicked(row: number, col: number): void {
    if (!this.game) return;                    // まだゲーム未紐付け
    if (this.game.isGameOver) return;          // 終局後は無視

    // 自分のターンのみ受け付ける（モデル側でも二重チェックされる想定）
    if (this.game.currentPlayer !== this.color) return;

    // 最新の合法手を取得しクリック座標が含まれるか確認
    const isValid = this.game
      .getAllValidPlaces()
      .some((pos: Position) => pos.row === row && pos.col === col);

    if (!isValid) return;                      // 非合法手なら無視

    // 合法手なので着手を依頼
    this.game.putStone(row, col);
  }
}
