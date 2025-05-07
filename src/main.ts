/* --------------------------------------------------
 * /src/main.ts
 * --------------------------------------------------
 * アプリケーションのエントリポイント。
 *  - ルート DOM 要素の確保
 *  - プレイヤー / ゲーム / View の生成
 *  - ゲーム開始
 * -------------------------------------------------- */

import { StoneColor }   from "./types/StoneColor";
import { OthelloGame }  from "./model/OthelloGame";
import { HumanPlayer }  from "./controller/HumanPlayer";
import { CpuPlayer }    from "./controller/CpuPlayer";
import { GameView }     from "./view/GameView";

/**
 * ルートとなる #app 要素を取得（無ければ作成）
 */
function getAppRoot(): HTMLElement {
  const existing = document.getElementById("app");
  if (existing) return existing;

  const created = document.createElement("div");
  created.id = "app";
  document.body.appendChild(created);
  return created;
}

/**
 * ゲームの初期化と起動
 */
function bootstrap(): void {
  const root = getAppRoot();

  /* ---------- プレイヤー設定 ---------- */
  const human = new HumanPlayer(StoneColor.BLACK);                // 先手：Human
  const cpu   = new CpuPlayer (StoneColor.WHITE, Math.random, /*IEvalStrategy*/); // 後手：CPU

  /* ---------- ゲーム本体 ---------- */
  const game = new OthelloGame(human, cpu);

  /* ---------- View ---------- */
  // GameView が Observer としてゲームに登録される
  new GameView(root, game, human);

  /* ---------- スタート ---------- */
  game.start();
}

window.addEventListener("DOMContentLoaded", bootstrap);
