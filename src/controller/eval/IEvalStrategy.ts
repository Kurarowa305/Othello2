import { Board } from "../../model/Board";
import { Position } from "../../types/Position";
import { StoneColor } from "../../types/StoneColor";

export interface IEvalStrategy {
  /**
   * 手の評価値を返す
   * @param board 現在の盤面（読み取り専用スナップショット）
   * @param color 評価対象プレイヤーの石色
   * @param move  着手候補（row / col）
   * @returns 評価値（大きいほど高評価）
   */
  evaluate(board: Board, color: StoneColor, move: Position): number;
}
