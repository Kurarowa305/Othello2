import { StoneColor }   from "./types/StoneColor";
import { OthelloGame }  from "./model/OthelloGame";
import { HumanPlayer }  from "./controller/HumanPlayer";
import { CpuPlayer }    from "./controller/CpuPlayer";
import { GameView }     from "./view/GameView";


function getAppRoot(): HTMLElement {
  const existing = document.getElementById("app");
  if (existing) return existing;

  const created = document.createElement("div");
  created.id = "app";
  document.body.appendChild(created);
  return created;
}


type PlayerPair = [HumanPlayer | CpuPlayer, HumanPlayer | CpuPlayer];


const playerFactories: Record<string, () => PlayerPair> = {
  "human-vs-cpu": () => [
    new HumanPlayer(StoneColor.BLACK),
    new CpuPlayer (StoneColor.WHITE, Math.random /*, IEvalStrategy*/),
  ],
  "human-vs-human": () => [
    new HumanPlayer(StoneColor.BLACK),
    new HumanPlayer(StoneColor.WHITE),
  ],
  "cpu-vs-cpu": () => [
    new CpuPlayer (StoneColor.BLACK, Math.random /*, IEvalStrategy*/),
    new CpuPlayer (StoneColor.WHITE, Math.random /*, IEvalStrategy*/),
  ],
};


function bootstrap(): void {
  const root = getAppRoot();

  // 仮実装（機能追加：ゲームモード選択）
  const gameMode = "human-vs-cpu";
  // const gameMode = "human-vs-human";
  // const gameMode = "cpu-vs-cpu";

  const [blackPlayer, whitePlayer] = playerFactories[gameMode]?.() 
    ?? (() => { throw new Error(`unknown mode: ${gameMode}`); })();

  const game = new OthelloGame(blackPlayer, whitePlayer);

  const humanControllers = [blackPlayer, whitePlayer]
    .filter(p => p instanceof HumanPlayer) as HumanPlayer[];

  new GameView(root, game, ...humanControllers);
  game.start();
}

window.addEventListener("DOMContentLoaded", bootstrap);
