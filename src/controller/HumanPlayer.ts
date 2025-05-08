import { StoneColor } from "../types/StoneColor";
import { Position } from "../types/Position";
import { Board } from "../model/Board";
import { OthelloGame } from "../model/OthelloGame";
import { IPlayer } from "./IPlayer";

export class HumanPlayer implements IPlayer {
  public readonly color: StoneColor;
  private game?: OthelloGame;

  
  public constructor(color: StoneColor) {
    this.color = color;
  }


  /** 未使用 */
  public chooseMove(_: Board): Position | null {
    return null;
  }


  public bindGame(game: OthelloGame): void {
    this.game = game;
  }


  public onCellClicked(row: number, col: number): void {
    if (!this.game) return;
    if (this.game.getIsGameOver()) return;
    if (this.game.getCurrentPlayer() !== this.color) return;

    const isValid = this.game
      .getAllValidPlaces()
      .some((pos: Position) => pos.row === row && pos.col === col);

    if (!isValid) return;
    
    this.game.putStone(row, col);
  }
}
