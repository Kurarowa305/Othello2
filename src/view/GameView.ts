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
  private readonly controller: HumanPlayer;
  private readonly game: OthelloGame;

  public constructor(root: HTMLElement, game: OthelloGame, controller: HumanPlayer) {
    this.root = root;
    this.game = game;
    this.controller = controller;

    this.root.classList.add("game-view");

    this.infoPanel = new GameInfoPanel();
    this.boardCanvas = new BoardCanvas(this.handleCellClick);
    this.endDialog = new EndGameDialog(this.handleRestart);

    this.root.appendChild(this.infoPanel.element);
    this.root.appendChild(this.boardCanvas.element);
    this.root.appendChild(this.endDialog.element);

    // Observer登録
    this.game.addObserver(this);
  }

  private handleCellClick = (row: number, col: number): void => {
    this.controller.onCellClicked(row, col);
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
    const { black, white } = this.game.countStones(); 
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
