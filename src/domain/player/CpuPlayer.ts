import StoneColor from '../StoneColor';
import OthelloGame from '../OthelloGame';
import IPlayer from './IPlayer';
import Position from '../Position';

class CpuPlayer implements IPlayer {
  private color: StoneColor = StoneColor.None;
  private game: OthelloGame | null = null;

  setColor(color: StoneColor): void {
    this.color = color;
  }

  setGame(game: OthelloGame): void {
    this.game = game;
  }

  playTurn(): void {
    // CPU player chooses a random valid move
    if (this.game) {
      const board = this.game.getBoard();
      const size = board.getSize();
      let validMoves: Position[] = [];

      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          const position = new Position(row, col);
          if (board.getStoneColor(position) === StoneColor.None) {
            // TODO: Check if the move is valid
            validMoves.push(position);
          }
        }
      }

      if (validMoves.length > 0) {
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        this.placeStone(randomMove);
      }
    }
  }

  placeStone(position: Position): void {
    if (this.game) {
      this.game.placeStone(position, this.color);
    }
  }
}

export default CpuPlayer;
