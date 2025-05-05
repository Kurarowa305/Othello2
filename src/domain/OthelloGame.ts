import Board from './Board';
import StoneColor from './StoneColor';
import Position from './Position';
import IPlayer from './player/IPlayer';
import IGameObserver from './IGameObserver';

class OthelloGame {
  private readonly board: Board;
  private currentPlayer: StoneColor = StoneColor.Black;
  private observers: IGameObserver[] = [];

  constructor(private readonly player1: IPlayer, private readonly player2: IPlayer, boardSize: number = 8) {
    this.board = new Board(boardSize);
    player1.setColor(StoneColor.Black);
    player2.setColor(StoneColor.White);
  }

  registerObserver(observer: IGameObserver): void {
    this.observers.push(observer);
  }

  startGame(): void {
    this.player1.setGame(this);
    this.player2.setGame(this);
    this.currentPlayer = StoneColor.Black;
    this.player1.playTurn();
  }

  getCurrentPlayer(): StoneColor {
    return this.currentPlayer;
  }

  getBoard(): Board {
    return this.board;
  }

  placeStone(position: Position, color: StoneColor): void {
    if (this.board.getStoneColor(position) !== StoneColor.None) {
      return;
    }

    this.board.setStoneColor(position, color);
    this.observers.forEach(observer => observer.stonePlaced(position, color));

    this.flipStones(position, color);

    if (this.isGameEnd()) {
      const winner = this.getWinner();
      this.observers.forEach(observer => observer.gameEnded(winner));
      return;
    }

    this.currentPlayer = this.currentPlayer === StoneColor.Black ? StoneColor.White : StoneColor.Black;
    if (this.currentPlayer === StoneColor.Black) {
      this.player1.playTurn();
    } else {
      this.player2.playTurn();
    }
  }

  private flipStones(position: Position, color: StoneColor): void {
    // TODO: Implement stone flipping logic
  }

  private isGameEnd(): boolean {
    // TODO: Implement game end check logic
    return false;
  }

  private getWinner(): StoneColor {
    // TODO: Implement winner determination logic
    return StoneColor.None;
  }
}

export default OthelloGame;
