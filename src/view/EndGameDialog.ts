export class EndGameDialog {
  public readonly element: HTMLDivElement;
  private readonly messageSpan: HTMLSpanElement;
  private readonly blackCountSpan: HTMLSpanElement;
  private readonly whiteCountSpan: HTMLSpanElement;
  private readonly onRestart?: () => void;


  public constructor(onRestart?: () => void) {
    this.onRestart = onRestart;

    this.element = document.createElement("div");
    this.element.classList.add("end-game-dialog");
    this.element.style.display = "none"; // 初期は非表示

    const dialogBox = document.createElement("div");
    dialogBox.classList.add("dialog-box");

    // タイトル
    const title = document.createElement("h2");
    title.textContent = "Game Over";
    dialogBox.appendChild(title);

    // 結果メッセージ (勝者 / 引き分け)
    this.messageSpan = document.createElement("span");
    this.messageSpan.classList.add("result-message");
    dialogBox.appendChild(this.messageSpan);

    // スコア表示
    const scoreWrapper = document.createElement("div");
    scoreWrapper.classList.add("score-wrapper");

    const blackLabel = document.createElement("span");
    blackLabel.textContent = "Black: ";
    this.blackCountSpan = document.createElement("span");

    const whiteLabel = document.createElement("span");
    whiteLabel.textContent = "  White: ";
    this.whiteCountSpan = document.createElement("span");

    scoreWrapper.appendChild(blackLabel);
    scoreWrapper.appendChild(this.blackCountSpan);
    scoreWrapper.appendChild(whiteLabel);
    scoreWrapper.appendChild(this.whiteCountSpan);

    dialogBox.appendChild(scoreWrapper);

    // 再開ボタン
    const restartBtn = document.createElement("button");
    restartBtn.textContent = "Restart";
    restartBtn.classList.add("restart-button");
    restartBtn.addEventListener("click", () => {
      this.hide();
      this.onRestart?.();
    });
    dialogBox.appendChild(restartBtn);

    this.element.appendChild(dialogBox);
  }


  private hide(): void {
    this.element.style.display = "none";
  }

  
  public showResult(black: number, white: number): void {
    if (black === white) {
      this.messageSpan.textContent = "Draw";
    } else if (black > white) {
      this.messageSpan.textContent = "Winner: Black";
    } else {
      this.messageSpan.textContent = "Winner: White";
    }

    this.blackCountSpan.textContent = String(black);
    this.whiteCountSpan.textContent = String(white);

    this.element.style.display = "flex";
  }

}
