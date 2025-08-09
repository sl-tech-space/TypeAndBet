/**
 * 結果のタイトル
 */
export const RESULT_TITLE = "タイピング結果";

/**
 * 結果の内容のキー
 */
export type ResultContentsKey = "SCORE" | "GOLD" | "RANKING" | "NEXT_RANKING";

/**
 * 結果の内容の型定義
 */
export type ResultContents = {
  [key in ResultContentsKey]: string;
};

/**
 * 結果の内容
 */
export const RESULT_CONTENTS = {
  SCORE: "スコア",
  GOLD: "所持ゴールド",
  RANKING: "ランキング",
  NEXT_RANKING: "次のランキングまで",
};
