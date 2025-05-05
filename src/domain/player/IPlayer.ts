import StoneColor from '../StoneColor';
import OthelloGame from '../OthelloGame';
import Position from '../Position';

interface IPlayer {
  setColor(color: StoneColor): void;
  setGame(game: OthelloGame): void;
  playTurn(): void;
  placeStone(position: Position): void;
}

export default IPlayer;
