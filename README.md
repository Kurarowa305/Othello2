# オセロゲーム

このプロジェクトは、HTML、CSS、TypeScriptで実装されたオセロゲームです。

## 特徴

-   UIは`BoardCanvas`、`GameInfoPanel`、`EndGameDialog`で構成されています。
-   ゲームロジックは`Board`、`OthelloGame`で実装されています。
-   プレイヤーは`HumanPlayer`と`CpuPlayer`を選択できます。

## 実行

`npm install`

`npm run dev`

## ファイル構成

-   `index.html`: エントリーポイント
-   `src/main.ts`: アプリケーションのエントリーファイル
-   `src/controller/`: プレイヤーや評価戦略などのコントローラ群
-   `src/model/`: ボードやゲームなどのモデル群
-   `src/view/`: UIコンポーネント

## 依存関係

-   TypeScript
-   Vite
