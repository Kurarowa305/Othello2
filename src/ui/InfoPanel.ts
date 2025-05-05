import StoneColor from '../domain/StoneColor';

class InfoPanel {
  private readonly infoElement: HTMLElement;

  constructor() {
    this.infoElement = document.createElement('div');
    this.infoElement.id = 'info-panel';
    document.getElementById('app')?.appendChild(this.infoElement);

    this.renderInfo();
  }

  updateCurrentPlayer(currentPlayer: StoneColor): void {
    this.renderInfo();
  }

  private renderInfo(): void {
    this.infoElement.innerHTML = `Current Player: ${currentPlayer}`;
  }
}

export default InfoPanel;
