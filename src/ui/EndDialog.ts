import StoneColor from '../domain/StoneColor';

class EndDialog {
  private readonly dialogElement: HTMLElement;

  constructor() {
    this.dialogElement = document.createElement('div');
    this.dialogElement.id = 'end-dialog';
    document.getElementById('app')?.appendChild(this.dialogElement);
    this.dialogElement.style.display = 'none'; // Hide by default

    this.renderDialog(StoneColor.None);
  }

  showDialog(winner: StoneColor): void {
    this.renderDialog(winner);
    this.dialogElement.style.display = 'block';
  }

  private renderDialog(winner: StoneColor): void {
    this.dialogElement.innerHTML = `Game Over! Winner: ${winner}`;
  }
}

export default EndDialog;
