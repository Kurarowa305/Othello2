import Board from '../domain/Board';
import StoneColor from '../domain/StoneColor';
import Position from '../domain/Position';
import IGameObserver from '../domain/IGameObserver';

class DomBoardView implements IGameObserver {
  private readonly boardElement: HTMLElement;

  constructor(private readonly board: Board) {
    this.boardElement = document.createElement('div');
    this.boardElement.id = 'board';
    document.getElementById('app')?.appendChild(this.boardElement);

    this.renderBoard();
  }

  stonePlaced(position: Position, color: StoneColor): void {
    this.renderBoard();
  }

  gameEnded(winner: StoneColor): void {
    // TODO: Implement game end dialog
  }

  renderBoard(): void {
    this.boardElement.innerHTML = '';
    const size = this.board.getSize();

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const position = new Position(row, col);
        const cell = document.createElement('div');
        cell.classList.add('cell');

        const stoneColor = this.board.getStoneColor(position);
        if (stoneColor === StoneColor.Black) {
          cell.classList.add('stone-black');
        } else if (stoneColor === StoneColor.White) {
          cell.classList.add('stone-white');
        }

        this.boardElement.appendChild(cell);
      }
    }
  }
}

export default DomBoardView;
