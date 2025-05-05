import StoneColor from './StoneColor';
import Position from './Position';

interface IGameObserver {
  stonePlaced(position: Position, color: StoneColor): void;
  gameEnded(winner: StoneColor): void;
}

export default IGameObserver;
