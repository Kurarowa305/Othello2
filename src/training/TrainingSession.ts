// src/training/TrainingSession.ts
import { Board } from "../model/Board";
import { StoneColor } from "../types/StoneColor";
import { OthelloGame } from "../model/OthelloGame";
import { IGameObserver } from "../model/observer/IGameObserver";

export class TrainingSession implements IGameObserver {
  private readonly game: OthelloGame;
  private remaining: number;

  public constructor(gameCount: number, game: OthelloGame) {
    this.remaining = gameCount;
    this.game = game;
    this.game.addObserver(this);
  }

  /* ---------- 開始 ---------- */
  public start(): void {
    this.game.start();           // 1 局目
  }

  /* ---------- IGameObserver ---------- */
  public onBoardUpdated(_: Board): void { /* 描画は GameView に任せる */ }
  public onTurnChanged(_: StoneColor): void {}

  public onGameEnded(_: Board): void {
    if (--this.remaining > 0) {
      // 画面フレームを挟んでから再開すると滑らか
      requestAnimationFrame(() => this.game.restart());
    } else {
      console.log("学習セッション終了");
    }
  }
}
