import { StoneColor } from "./types/StoneColor";
import { OthelloGame } from "./model/OthelloGame";
import { HumanPlayer } from "./controller/HumanPlayer";
import { CpuPlayer } from "./controller/CpuPlayer";
import { GameView } from "./view/GameView";

window.addEventListener("DOMContentLoaded", () => {
  const root: HTMLElement = (() => {
    const el = document.getElementById("app");
    if (el) return el;

    const created = document.createElement("div");
    created.id = "app";
    document.body.appendChild(created);
    return created;
  })();

  // 仮実装
  const human = new HumanPlayer(StoneColor.BLACK);                // 先手：Human
  const cpu   = new CpuPlayer (StoneColor.WHITE, Math.random);    // 後手：CPU

  const game = new OthelloGame(human, cpu);

  new GameView(root, game, human);

  game.start();
});
