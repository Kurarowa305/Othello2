import { Board } from "../model/Board";
import { OthelloGame } from "../model/OthelloGame";
import { IGameObserver } from "../model/observer/IGameObserver";
import { BoardCanvas } from "./BoardCanvas";
import { GameInfoPanel } from "./GameInfoPanel";
import { EndGameDialog } from "./EndGameDialog";
import { HumanPlayer } from "../controller/HumanPlayer";
import { StoneColor } from "../types/StoneColor";

export class GameView implements IGameObserver {
  private readonly root: HTMLElement;
  private readonly boardCanvas: BoardCanvas;
  private readonly infoPanel: GameInfoPanel;
  private readonly endDialog: EndGameDialog;
  private readonly controller1?: HumanPlayer | null;
  private readonly controller2?: HumanPlayer | null;
  private readonly game: OthelloGame;


  public constructor(root: HTMLElement, game: OthelloGame, controller1?: HumanPlayer, controller2?: HumanPlayer) {
    this.root = root;
    this.game = game;
    this.controller1 = controller1 ?? null;
    this.controller2 = controller2 ?? null;

    this.root.classList.add("game-view");

    this.infoPanel = new GameInfoPanel();
    this.boardCanvas = new BoardCanvas(this.handleCellClick);
    this.endDialog = new EndGameDialog(this.handleRestart);

    this.root.appendChild(this.infoPanel.element);
    this.root.appendChild(this.boardCanvas.element);
    this.root.appendChild(this.endDialog.element);

    this.game.addObserver(this);
  }


  private handleCellClick = (row: number, col: number): void => {
    if (this.controller1 && this.game.getCurrentPlayer() === this.controller1.color) {
      this.controller1.onCellClicked(row, col);
    }
    if (this.controller2 && this.game.getCurrentPlayer() === this.controller2.color) {
      this.controller2.onCellClicked(row, col);
    }
  };

  
  private handleRestart = (): void => {
    this.game.restart();
  };


  /* ============================================================
   * IGameObserver 実装
   * ============================================================ */

  public onBoardUpdated(board: Board): void {
    const validMoves = this.game.getAllValidPlaces();
    this.boardCanvas.render(board);
    this.boardCanvas.highlight(validMoves);
    const { black, white } = this.game.countStones(board); 
    this.infoPanel.showCount(black, white);
  }


  public onTurnChanged(current: StoneColor): void {
    this.infoPanel.showTurn(current);
  }


  public onGameEnded(board: Board): void {
    this.boardCanvas.render(board);
    const { black, white } = this.game.countStones(board);
    this.endDialog.showResult(black, white);
  }

}
