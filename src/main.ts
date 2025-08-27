import { StoneColor }   from "./types/StoneColor";
import { OthelloGame }  from "./model/OthelloGame";
import { HumanPlayer }  from "./controller/HumanPlayer";
import { CpuPlayer }    from "./controller/CpuPlayer";
import { GameView }     from "./view/GameView";
import { RandomEval } from "./controller/eval/RandomEval";
import { TrainingSession } from "./training/TrainingSession";
import { LearningEval } from "./controller/eval/LearningEval";

const TRAINING_MODE   = false;   // ← 学習モードの ON / OFF
const SHOW_UI         = true;   // ← 盤面を描画するか
const TRAINING_GAMES  = 500;    // ← 連続対局数
const CPU_DELAY_MS    = SHOW_UI ? 10 : 0; // CPU プレイヤーの待機時間（ミリ秒）

// 仮実装（機能追加：ゲームモード選択）
const gameMode = "human-vs-cpu";
// const gameMode = "human-vs-human";
// const gameMode = "cpu-vs-cpu";


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
    new CpuPlayer (StoneColor.WHITE, Math.random, new LearningEval()),
  ],
  "human-vs-human": () => [
    new HumanPlayer(StoneColor.BLACK),
    new HumanPlayer(StoneColor.WHITE),
  ],
  "cpu-vs-cpu": () => [
    new CpuPlayer (StoneColor.BLACK, Math.random, new LearningEval()),
    new CpuPlayer (StoneColor.WHITE, Math.random, new LearningEval()),
  ],
};


function bootstrap(): void {
  if (TRAINING_MODE) {
    const blackCPU = new CpuPlayer(StoneColor.BLACK, Math.random, new LearningEval());
    const whiteCPU = new CpuPlayer(StoneColor.WHITE, Math.random, new LearningEval());

    OthelloGame.CPU_PLAYER_DELAY = CPU_DELAY_MS;

    const game = new OthelloGame(blackCPU, whiteCPU);

    if (SHOW_UI) {
      const root = getAppRoot();
      new GameView(root, game); 
    }

    new TrainingSession(TRAINING_GAMES, game).start();
    return;
  }
  
  const root = getAppRoot();

  const [blackPlayer, whitePlayer] = playerFactories[gameMode]?.() 
    ?? (() => { throw new Error(`unknown mode: ${gameMode}`); })();

  const game = new OthelloGame(blackPlayer, whitePlayer);

  const humanControllers = [blackPlayer, whitePlayer]
    .filter(p => p instanceof HumanPlayer) as HumanPlayer[];

  new GameView(root, game, ...humanControllers);
  game.start();
}

window.addEventListener("DOMContentLoaded", bootstrap);
