# オセロゲーム

このプロジェクトは、HTML、CSS、TypeScriptで実装されたオセロゲームです。

## 特徴

-   UIは`DomBoardView`、`InfoPanel`、`EndDialog`で構成されています。
-   ゲームロジックは`Board`、`OthelloGame`で実装されています。
-   プレイヤーは`HumanPlayer`と`CpuPlayer`を選択できます。

## 実行

'''bash
    npm install
    npm run dev
'''

## ファイル構成

-   `index.html`: エントリーポイント
-   `src/app.ts`: メインロジック
-   `src/domain/`: ドメインオブジェクト
-   `src/ui/`: UIコンポーネント

## 依存関係

-   TypeScript
-   Vite
