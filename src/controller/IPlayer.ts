/* --------------------------------------------------
 * /src/controller/IPlayer.ts
 * --------------------------------------------------
 * プレイヤー（人間／CPU 共通）が実装すべきインターフェース。
 *  - 所属する石色の保持（color）
 *  - 現在の盤面を受け取り、次に打つ手を返す chooseMove()
 *    ・合法手がない／打たない場合は null を返す
 * -------------------------------------------------- */

import { StoneColor } from "../types/StoneColor";
import { Position } from "../types/Position";
import { Board } from "../model/Board";

/** プレイヤー（Human / CPU）が備える共通 API */
export interface IPlayer {
  /** プレイヤーが担当する石色 */
  readonly color: StoneColor;

  /**
   * 次の一手を決定する。
   * @param board 現在の盤面（読み取り専用スナップショット）
   * @returns 着手位置。パスする場合は `null` を返す。
   */
  chooseMove(board: Board): Position | null;
}
