# システム仕様書

## 概要
このプロジェクトは TypeScript で実装され、Vite でビルドされるブラウザ向けのオセロゲームです。

## アーキテクチャ

### エントリーポイント
`src/main.ts` はゲームモードの選択、プレイヤーインスタンスの生成、`OthelloGame` の接続、ページ読み込み時の `GameView` 起動を行います【F:src/main.ts†L22-L56】【F:src/main.ts†L58-L58】

### モデル層
- `OthelloGame` は盤面状態を管理し、ターン進行・パス処理・オブザーバ通知を担当します。CPU の手番では手の選択前に遅延を設定できます【F:src/model/OthelloGame.ts†L9-L116】
- `Board` は 8×8 のグリッドを表し、初期配置の生成、手の妥当性チェック、石の反転を実行します【F:src/model/Board.ts†L4-L73】

### コントローラ層
- `IPlayer` はプレイヤーが実装すべき `chooseMove` 契約を定義します【F:src/controller/IPlayer.ts†L5-L13】
- `HumanPlayer` は自分のターンかつ有効手の場合に限り盤面クリックをゲームへ渡します【F:src/controller/HumanPlayer.ts†L7-L40】
- `CpuPlayer` は合法手を列挙し、差し替え可能な評価戦略で一手を選択します。デフォルトではランダムに選択します【F:src/controller/CpuPlayer.ts†L8-L62】

### ビュー層
- `GameView` は UI コンポーネントを組み立て、オブザーバとしてゲーム更新に反応します【F:src/view/GameView.ts†L10-L77】
- `BoardCanvas` はクリック可能な盤面グリッドを描画し、有効手をハイライトします【F:src/view/BoardCanvas.ts†L5-L84】
- `GameInfoPanel` は現在の手番と石数を表示します【F:src/view/GameInfoPanel.ts†L3-L64】
- `EndGameDialog` は最終結果を示し、ゲームの再開を可能にします【F:src/view/EndGameDialog.ts†L1-L80】

### オブザーバパターン
オブザーバは `IGameObserver` を実装し、盤面の変更・ターン切り替え・ゲーム終了時に通知を受け取ります【F:src/model/observer/IGameObserver.ts†L5-L21】【F:src/model/OthelloGame.ts†L185-L200】

## ゲーム進行
1. `OthelloGame.start` は盤面をリセットし初期更新を発行し、必要なら CPU の手番を開始します【F:src/model/OthelloGame.ts†L34-L39】
2. `putStone` は手の妥当性確認と適用、パス回数リセット、ターン進行を行います【F:src/model/OthelloGame.ts†L86-L93】
3. `switchPlayer` は終局条件の確認、オブザーバ通知、CPU の手番とパス処理を行います【F:src/model/OthelloGame.ts†L96-L116】
4. 連続パスまたは盤面が埋まるとゲーム終了となり、オブザーバを介して結果が表示されます【F:src/model/OthelloGame.ts†L136-L151】

## ビルドと実行
- 依存関係のインストール: `npm install`
- 開発サーバー: `npm run dev`
- 本番ビルド: `npm run build` ― TypeScript のコンパイルと Vite のバンドルを実行します【F:package.json†L6-L9】
