/* --------------------------------------------------
 * 乱数ジェネレータ型 & 標準実装
 * --------------------------------------------------
 * 0 ≦ r < 1 の実数を返す関数型エイリアス。
 * テストではモック関数を注入することで
 * CpuPlayer / RandomEval の挙動を固定できます。
 * -------------------------------------------------- */

export type RandomGenerator = () => number;

/** デフォルト実装（Math.random のラッパー） */
export const defaultRandomGenerator: RandomGenerator = Math.random;
