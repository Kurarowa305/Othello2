import StoneColor from './StoneColor';
import Position from './Position';

class Board {
  private readonly board: StoneColor[][];

  constructor(private readonly size: number) {
    this.board = Array(size).fill(null).map(() => Array(size).fill(StoneColor.None));
    this.board[size / 2 - 1][size / 2 - 1] = StoneColor.White;
    this.board[size / 2][size / 2] = StoneColor.White;
    this.board[size / 2 - 1][size / 2] = StoneColor.Black;
    this.board[size / 2][size / 2 - 1] = StoneColor.Black;
  }

  getSize(): number {
    return this.size;
  }

  getStoneColor(position: Position): StoneColor {
    return this.board[position.row][position.col];
  }

  setStoneColor(position: Position, color: StoneColor): void {
    this.board[position.row][position.col] = color;
  }
}

export default Board;
