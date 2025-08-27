import { StoneColor } from "../types/StoneColor";
import { Position } from "../types/Position";
import { Board } from "../model/Board";
import { IPlayer } from "./IPlayer";
import { IEvalStrategy } from "./eval/IEvalStrategy";
import { RandomEval } from "./eval/RandomEval";
import { LearningEval } from "./eval/LearningEval";

export class CpuPlayer implements IPlayer {
  public readonly color: StoneColor;
  public static readonly BOARD_SIZE = 8;
  private readonly rng: () => number; // 乱数生成器
  private readonly strategy: IEvalStrategy | null; // 評価戦略


  public constructor(
    color: StoneColor,
    rng: () => number = Math.random,
    strategy: IEvalStrategy | null = null,
  ) {
    this.color = color;
    this.rng = rng;
    this.strategy = strategy ?? new RandomEval(rng);
  }


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
      return null;
    }

    /* ---------- 戦略評価 or ランダム選択 ---------- */
    if (!this.strategy) {
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

    // 学習用に着手を保存
    if (this.strategy instanceof LearningEval && pick) {
      this.strategy.record(pick);  
    }

    return pick;
  }


  public onGameEnd(winner: StoneColor): void {
    if (!(this.strategy instanceof LearningEval)) return;

    const reward =
      winner === StoneColor.EMPTY ? 0 :
      winner === this.color        ? +1 :
                                    -1;
    this.strategy.learn(reward);
  }
}
