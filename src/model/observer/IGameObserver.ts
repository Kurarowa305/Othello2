/* --------------------------------------------------
 * /src/model/observer/IGameObserver.ts
 * --------------------------------------------------
 * Model（OthelloGame）側の状態変化を View に伝える
 * Observer インターフェース。
 *   ・盤面更新
 *   ・手番変更
 *   ・ゲーム終了
 * -------------------------------------------------- */

import { Board } from "../Board";
import { StoneColor } from "../../types/StoneColor";

/**
 * ゲーム状態の変更を受け取る Observer。
 * View 側は本インターフェースを実装し、OthelloGame に
 * addObserver(...) で登録する。
 */
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
