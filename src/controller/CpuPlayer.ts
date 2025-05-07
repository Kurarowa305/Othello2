/* --------------------------------------------------
 * /src/controller/CpuPlayer.ts
 * --------------------------------------------------
 * 盤面を受け取り「次の一手」を返すシンプルな CPU。
 *  - 乱数ジェネレータを DI することでテスト容易性を確保
 *  - 評価戦略 (IEvalStrategy) を切り替えられるようにし、
 *    未指定時はランダムに手を選択
 * -------------------------------------------------- */

import { StoneColor } from "../types/StoneColor";
import { Position } from "../types/Position";
import { Board } from "../model/Board";
import { IPlayer } from "./IPlayer";
import { IEvalStrategy } from "./eval/IEvalStrategy";
import { RandomEval } from "./eval/RandomEval";

/**
 * CpuPlayer
 * --------------------------------------------------
 * - chooseMove が同期的に呼ばれ、合法手の中から 1 手を返す
 * - 評価戦略が無ければ純粋ランダム
 * - 同点手が複数ある場合は乱数でブレークタイ
 */
export class CpuPlayer implements IPlayer {
  public readonly color: StoneColor;
  public static readonly BOARD_SIZE = 8;

  /** テスト容易性のために注入する乱数ジェネレータ (0 ≦ r < 1) */
  private readonly rng: () => number;

  /** 手の良し悪しを数値化する戦略オブジェクト */
  private readonly strategy: IEvalStrategy | null;

  public constructor(
    color: StoneColor,
    rng: () => number = Math.random,
    strategy: IEvalStrategy | null = null,
  ) {
    this.color = color;
    this.rng = rng;
    // 戦略未指定ならランダム戦略をデフォルト適用
    this.strategy = strategy ?? new RandomEval(rng);
  }

  /* --------------------------------------------------
   * IPlayer 実装
   * -------------------------------------------------- */

  public chooseMove(board: Board): Position | null {
    /* ---------- 合法手の列挙 ---------- */
    const validMoves: Position[] = [];
    for (let r = 0; r < CpuPlayer.BOARD_SIZE; r++) {
      for (let c = 0; c < CpuPlayer.BOARD_SIZE; c++) {
        if (board.canPutStone(r, c, this.color)) {
          validMoves.push({ row: r, col: c });
        }
      }
    }

    if (validMoves.length === 0) {
      // パス
      return null;
    }

    /* ---------- 戦略評価 or ランダム選択 ---------- */
    if (!this.strategy) {
      // 完全ランダム
      const idx = Math.floor(this.rng() * validMoves.length);
      return validMoves[idx];
    }

    // 評価値の高い手を収集
    let bestScore = -Infinity;
    let bestMoves: Position[] = [];

    for (const mv of validMoves) {
      const score = this.strategy.evaluate(board, this.color, mv);
      if (score > bestScore) {
        bestScore = score;
        bestMoves = [mv];
      } else if (score === bestScore) {
        bestMoves.push(mv);
      }
    }

    // 同スコアは乱数で決定
    const pick = bestMoves[Math.floor(this.rng() * bestMoves.length)];
    return pick;
  }
}
