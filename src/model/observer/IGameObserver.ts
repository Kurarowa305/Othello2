import { Board } from "../Board";
import { StoneColor } from "../../types/StoneColor";

export interface IGameObserver {
  /**
   * 盤面が更新されたときに呼び出される。
   * @param board ゲーム側から渡される盤面のスナップショット
   */
  onBoardUpdated(board: Board): void;

  /**
   * 手番が切り替わったときに呼び出される。
   * @param current 現在手番の石色
   */
  onTurnChanged(current: StoneColor): void;

  /**
   * ゲームが終了したときに呼び出される。
   * @param board 終局時点の盤面スナップショット
   */
  onGameEnded(board: Board): void;
}
