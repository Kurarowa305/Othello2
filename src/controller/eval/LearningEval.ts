// 着手位置ごとの重みを学習する簡易戦略
import { IEvalStrategy } from "./IEvalStrategy";
import { Board } from "../../model/Board";
import { StoneColor } from "../../types/StoneColor";
import { Position } from "../../types/Position";
import { RandomGenerator } from "../utils/RandomGenerator";

export class LearningEval implements IEvalStrategy {
  /** localStorage のキー */
  private static readonly STORAGE_KEY = "cpuWeights_v1";

  /** 盤面 8×8 の重みテーブル */
  private weights: number[][];
  private readonly rng: RandomGenerator;
  /** 今対局で CPU が打った手を保存（学習時に使用） */
  private readonly history: Position[] = [];

  /* ---------- 初期化 ---------- */
  public constructor(rng: RandomGenerator = Math.random) {
    this.rng = rng;
    /* 保存済み or 既定の重み */
    this.weights = LearningEval.load() ?? LearningEval.defaultWeights();
  }

  /* ---------- IEvalStrategy 実装 ---------- */
  public evaluate(_: Board, __: StoneColor, move: Position): number {
    // 重み + わずかなノイズで探索も兼ねる
    return this.weights[move.row][move.col] + this.rng() * 0.05;
  }

  /* ---------- 学習用の補助 ---------- */
  public record(move: Position): void {
    this.history.push(move);
  }

  public learn(reward: number): void {
    const lr = 0.1;                       // 学習率
    for (const mv of this.history) {
      this.weights[mv.row][mv.col] += lr * reward;
    }
    this.history.length = 0;              // 履歴をクリア
    LearningEval.save(this.weights);      // 永続化
  }

  /* ---------- 重みの永続化 ---------- */
  private static load(): number[][] | null {
    const json = localStorage.getItem(LearningEval.STORAGE_KEY);
    if (!json) return null;
    try { return JSON.parse(json); } catch { return null; }
  }
  private static save(w: number[][]): void {
    localStorage.setItem(LearningEval.STORAGE_KEY, JSON.stringify(w));
  }
  private static defaultWeights(): number[][] {
    // 角 > 辺 > 内側 のごく簡単な初期値
    const base = [
      20, -7, 11,  8,  8, 11, -7, 20,
      -7,-10, -4,  2,  2, -4,-10, -7,
      11, -4,  5,  2,  2,  5, -4, 11,
       8,  2,  2,  1,  1,  2,  2,  8,
       8,  2,  2,  1,  1,  2,  2,  8,
      11, -4,  5,  2,  2,  5, -4, 11,
      -7,-10, -4,  2,  2, -4,-10, -7,
      20, -7, 11,  8,  8, 11, -7, 20,
    ];
    const w: number[][] = [];
    for (let r = 0; r < Board.SIZE; r++) {
      w.push(base.slice(r * Board.SIZE, (r + 1) * Board.SIZE));
    }
    return w;
  }
}