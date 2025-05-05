import StoneColor from '../StoneColor';
import OthelloGame from '../OthelloGame';
import IPlayer from './IPlayer';
import Position from '../Position';

class HumanPlayer implements IPlayer {
  private color: StoneColor = StoneColor.None;
  private game: OthelloGame | null = null;

  setColor(color: StoneColor): void {
    this.color = color;
  }

  setGame(game: OthelloGame): void {
    this.game = game;
  }

  playTurn(): void {
    // Human player waits for user input
  }

  placeStone(position: Position): void {
    if (this.game) {
      this.game.placeStone(position, this.color);
    }
  }
}

export default HumanPlayer;
