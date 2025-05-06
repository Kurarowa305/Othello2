import { StoneColor } from "../types/StoneColor";

export class GameInfoPanel {
  public readonly element: HTMLDivElement;
  private readonly turnSpan: HTMLSpanElement;
  private readonly blacCountkSpan: HTMLSpanElement;
  private readonly whiteCountSpan: HTMLSpanElement;

  public constructor() {
    this.element = document.createElement("div");
    this.element.classList.add("game-info-panel");

    /* ---------- ターン表示 ---------- */
    const turnWrapper = document.createElement("div");
    turnWrapper.classList.add("turn-wrapper");

    const turnLabel = document.createElement("span");
    turnLabel.textContent = "Turn: ";

    this.turnSpan = document.createElement("span");
    this.turnSpan.classList.add("turn-value");

    turnWrapper.appendChild(turnLabel);
    turnWrapper.appendChild(this.turnSpan);

    /* ---------- 石数表示 ---------- */
    const countWrapper = document.createElement("div");
    countWrapper.classList.add("count-wrapper");

    const blackLabel = document.createElement("span");
    blackLabel.textContent = "Black: ";

    this.blacCountkSpan = document.createElement("span");
    this.blacCountkSpan.classList.add("black-count");

    const whiteLabel = document.createElement("span");
    whiteLabel.textContent = "  White: ";

    this.whiteCountSpan = document.createElement("span");
    this.whiteCountSpan.classList.add("white-count");

    countWrapper.appendChild(blackLabel);
    countWrapper.appendChild(this.blacCountkSpan);
    countWrapper.appendChild(whiteLabel);
    countWrapper.appendChild(this.whiteCountSpan);

    this.element.appendChild(turnWrapper);
    this.element.appendChild(countWrapper);
  }

  public showTurn(color: StoneColor): void {
    this.turnSpan.textContent = color === StoneColor.BLACK ? "Black" : "White";

    this.element.classList.toggle("black-turn", color === StoneColor.BLACK);
    this.element.classList.toggle("white-turn", color === StoneColor.WHITE);
  }

  public showCount(black: number, white: number): void {
    this.blacCountkSpan.textContent = String(black);
    this.whiteCountSpan.textContent = String(white);
  }
}
