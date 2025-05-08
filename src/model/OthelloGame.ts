import { StoneColor } from "../types/StoneColor";
import { Position } from "../types/Position";
import { Board } from "./Board";
import { IPlayer } from "../controller/IPlayer";
import { HumanPlayer } from "../controller/HumanPlayer";
import { CpuPlayer } from "../controller/CpuPlayer";
import { IGameObserver } from "./observer/IGameObserver";

export class OthelloGame {
  public static readonly CPU_PLAYER_DELAY = 1000; // CPU プレイヤーの待機時間（ミリ秒）
  private board: Board = new Board();
  private readonly players: Record<StoneColor, IPlayer>;
  private currentPlayer: StoneColor; 
  private isGameOver = false;  
  private consecutivePass = 0; // 連続パス回数
  private readonly observers = new Set<IGameObserver>();


  public constructor(playerBlack: IPlayer, playerWhite: IPlayer) {
    this.players = {
      [StoneColor.BLACK]: playerBlack,
      [StoneColor.WHITE]: playerWhite,
      [StoneColor.EMPTY]: playerBlack, // ダミー
    };

    [playerBlack, playerWhite].forEach(p => {
      if (p instanceof HumanPlayer) p.bindGame(this);
    });

    this.currentPlayer = StoneColor.BLACK; // 黒番先手
  }


  public start(): void {
    this.resetInternalState();
    this.notifyBoardUpdated();
    this.notifyTurnChanged();
    this.advanceIfCpuTurn();
  }


  public restart(): void {
    this.start();
  }


  public addObserver(obs: IGameObserver): void {
    this.observers.add(obs);
  }


  public getCurrentPlayer(): StoneColor {
    return this.currentPlayer;
  }


  public getIsGameOver(): boolean {
    return this.isGameOver;
  }

  
  public getAllValidPlaces(): Position[] {
    const list: Position[] = [];
    for (let r = 0; r < Board.SIZE; r++) {
      for (let c = 0; c < Board.SIZE; c++) {
        if (this.board.canPutStone(r, c, this.currentPlayer)) list.push({ row: r, col: c });
      }
    }
    return list;
  }


  public countStones(board: Board): { black: number; white: number } {
    let black = 0, white = 0;
    for (let r = 0; r < Board.SIZE; r++) {
      for (let c = 0; c < Board.SIZE; c++) {
        const cell = board.getCell(r, c);
        if (cell === StoneColor.BLACK) black++;
        else if (cell === StoneColor.WHITE) white++;
      }
    }
    return { black, white };
  }


  public putStone(row: number, col: number): void {
    if (this.isGameOver) return;
    if (!this.board.canPutStone(row, col, this.currentPlayer)) return;

    this.board.applyMove(row, col, this.currentPlayer);
    this.consecutivePass = 0;
    this.switchPlayer();
  }


  private async switchPlayer(): Promise<void> {
    this.currentPlayer = this.opposite(this.currentPlayer);

    if (this.isBoardFull()) {             
      this.endGame();                                          
      return;
    }
    if (this.getAllValidPlaces().length === 0) {
      this.pass()
      return;
    }
  
    this.notifyTurnChanged();
    this.notifyBoardUpdated();

    await this.advanceIfCpuTurn();
  }
  

  /** CPUのターン(chooseMove → putStone → switchPlayer) */
  private async advanceIfCpuTurn(): Promise<void> {
    if (this.isGameOver) return;
    const player = this.players[this.currentPlayer];
    if (!(player instanceof CpuPlayer)) return;

    await this.delay(OthelloGame.CPU_PLAYER_DELAY);   

    if (this.isGameOver) {  
      return;
    }

    const move = player.chooseMove(this.board.clone());
    if (move) {
      this.putStone(move.row, move.col);
    } else {
      this.pass();
    }
  }


  private pass(): void {
    this.consecutivePass++;
      if (this.consecutivePass >= 2) {
        this.endGame();
        return;
      }
      // 仮実装（機能追加：UIにパス表示）
      console.log(this.consecutivePass);
      this.switchPlayer();
  }


  private endGame(): void {
    this.isGameOver = true;
    this.notifyGameEnded();
  }


  private resetInternalState(): void {
    this.board = new Board();
    this.currentPlayer = StoneColor.BLACK;
    this.isGameOver = false;
    this.consecutivePass = 0;
  }


  /* ============================================================
   * ユーティリティ
   * ============================================================ */

  private opposite(c: StoneColor): StoneColor {
    return c === StoneColor.BLACK ? StoneColor.WHITE : StoneColor.BLACK;
  }


  private delay(ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
  }


  private isBoardFull(): boolean {
    const { black, white } = this.countStones(this.board);
    return black + white >= Board.SIZE * Board.SIZE;
  }


  /* ============================================================
   * Observer 通知
   * ============================================================ */

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
