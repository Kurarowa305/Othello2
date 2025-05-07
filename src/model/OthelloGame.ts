/* --------------------------------------------------
 * /src/model/OthelloGame.ts
 * --------------------------------------------------
 * ゲーム進行ロジックを一手に担う Model クラス。
 *  - 盤面状態の保持と更新
 *  - 手番管理／パス判定／終局判定
 *  - View への通知 (Observer パターン)
 *  - CPU 手の自動実行
 * -------------------------------------------------- */

import { StoneColor } from "../types/StoneColor";
import { Position } from "../types/Position";
import { Board } from "./Board";
import { IPlayer } from "../controller/IPlayer";
import { HumanPlayer } from "../controller/HumanPlayer";
import { CpuPlayer } from "../controller/CpuPlayer";
import { IGameObserver } from "./observer/IGameObserver";

export class OthelloGame {
  /* ==============================  フィールド  ============================== */
  private board: Board = new Board();                // 現在の盤面
  private readonly players: Record<StoneColor, IPlayer>;
  public  currentPlayer: StoneColor;                 // 手番
  public  isGameOver = false;                        // 終局フラグ
  private consecutivePass = 0;                       // 連続パス回数
  private readonly observers = new Set<IGameObserver>();

  /* ==============================  初期化  ============================== */

  public constructor(playerBlack: IPlayer, playerWhite: IPlayer) {
    // プレイヤー登録
    this.players = {
      [StoneColor.BLACK]: playerBlack,
      [StoneColor.WHITE]: playerWhite,
      [StoneColor.EMPTY]: playerBlack, // ダミー (参照しない)
    };

    // HumanPlayer にはゲームインスタンスをバインド
    [playerBlack, playerWhite].forEach(p => {
      if (p instanceof HumanPlayer) p.bindGame(this);
    });

    this.currentPlayer = StoneColor.BLACK; // 先手固定
  }

  /* ==============================  Public API  ============================== */

  /** ゲームを開始する (盤面を初期化し通知) */
  public start(): void {
    this.resetInternalState();
    this.notifyBoardUpdated();
    this.notifyTurnChanged();
    this.advanceIfCpuTurn(); // 先手が CPU の可能性に対応
  }

  /** ゲームをリセットして再開 */
  public restart(): void {
    this.start();
  }

  /** 合法手の一覧を返す */
  public getAllValidPlaces(color: StoneColor = this.currentPlayer): Position[] {
    const list: Position[] = [];
    for (let r = 0; r < Board.SIZE; r++) {
      for (let c = 0; c < Board.SIZE; c++) {
        if (this.board.canPutStone(r, c, color)) list.push({ row: r, col: c });
      }
    }
    return list;
  }

  /** 着手を確定させる (Human からも CPU からもここに集約) */
  public putStone(row: number, col: number): void {
    if (this.isGameOver) return;
    if (!this.board.canPutStone(row, col, this.currentPlayer)) return;

    // 石を置いて反転
    this.board.applyMove(row, col, this.currentPlayer);
    this.consecutivePass = 0; // パス連続をリセット
    
    // 手番交代 & 継続
    this.switchPlayer();
    this.notifyBoardUpdated();
  }

  /** 観測者を登録 */
  public addObserver(obs: IGameObserver): void {
    this.observers.add(obs);
  }

  /** 盤上の石数を返す (View 用ユーティリティ) */
  public countStones(target: Board = this.board): { black: number; white: number } {
    let black = 0, white = 0;
    for (let r = 0; r < Board.SIZE; r++) {
      for (let c = 0; c < Board.SIZE; c++) {
        const cell = target.getCell(r, c);
        if (cell === StoneColor.BLACK) black++;
        else if (cell === StoneColor.WHITE) white++;
      }
    }
    return { black, white };
  }

  /* ==============================  内部ロジック  ============================== */

  /** 手番を切り替える。必要ならパス／終局処理も行う */
  private switchPlayer(): void {
    this.currentPlayer = this.opposite(this.currentPlayer);

    const valid = this.getAllValidPlaces();
    if (valid.length === 0) {
      // パス
      this.consecutivePass++;

      if (this.consecutivePass >= 2) {
        this.endGame();
        return;
      }

      // 相手に回して継続
      this.notifyTurnChanged();
      this.switchPlayer(); // 再帰的に手番を戻す
      return;
    }

    this.notifyTurnChanged();
    this.advanceIfCpuTurn();
  }

  /** CPU の手番なら自動的に手を選び実行 (1 秒ディレイ付き) */
private advanceIfCpuTurn(): void {
  if (this.isGameOver) return;

  const player = this.players[this.currentPlayer];
  if (!(player instanceof CpuPlayer)) return;

  /* ---------- ここで 1 秒待機 ---------- */
  setTimeout(() => {
    // 途中でゲームが終了していないか再チェック
    if (this.isGameOver) return;

    const move = player.chooseMove(this.board.clone());
    if (move) {
      this.putStone(move.row, move.col); // 手を指すと turn 交代まで再帰処理
    } else {
      // 合法手ゼロ → パス扱い
      this.consecutivePass++;
      if (this.consecutivePass >= 2) {
        this.endGame();
      } else {
        this.switchPlayer();
      }
    }
  }, 1000); 
}

  /** 終局処理 */
  private endGame(): void {
    this.isGameOver = true;
    this.notifyGameEnded();
  }

  /** 内部状態のリセット (再開用) */
  private resetInternalState(): void {
    this.board = new Board();
    this.currentPlayer = StoneColor.BLACK;
    this.isGameOver = false;
    this.consecutivePass = 0;
  }

  /** 石色の反転ユーティリティ */
  private opposite(c: StoneColor): StoneColor {
    return c === StoneColor.BLACK ? StoneColor.WHITE : StoneColor.BLACK;
  }

  /* ==============================  Observer 通知  ============================== */

  private notifyBoardUpdated(): void {
    const snapshot = this.board.clone();
    this.observers.forEach(o => o.onBoardUpdated(snapshot));
  }

  private notifyTurnChanged(): void {
    this.observers.forEach(o => o.onTurnChanged(this.currentPlayer));
  }

  private notifyGameEnded(): void {
    const snapshot = this.board.clone();
    this.observers.forEach(o => o.onGameEnded(snapshot));
  }
}
