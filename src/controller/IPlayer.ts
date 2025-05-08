import { StoneColor } from "../types/StoneColor";
import { Position } from "../types/Position";
import { Board } from "../model/Board";

export interface IPlayer {
  readonly color: StoneColor;

  /**
   * 次の一手を決定する。
   * @param board 現在の盤面（読み取り専用スナップショット）
   * @returns 着手位置。パスする場合は `null` を返す。
   */
  chooseMove(board: Board): Position | null;
}
