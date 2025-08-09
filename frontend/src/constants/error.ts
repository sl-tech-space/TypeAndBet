/**
 * エラーメッセージの型定義
 */
export type ErrorMessageKey =
  | "UNEXPECTED"
  | "LOGIN_FAILED"
  | "SIGNUP_FAILED"
  | "GENERATE_TEXT_FAILED"
  | "CREATE_BET_FAILED"
  | "GRAPHQL_ERROR"
  | "COMPLETE_SIMULATE_FAILED"
  | "COMPLETE_PLAY_FAILED";

export type ErrorMessages = {
  [key in ErrorMessageKey]: string;
};

export const ERROR_MESSAGE: ErrorMessages = {
  UNEXPECTED: "予期せぬエラーが発生しました",
  LOGIN_FAILED: "ログインに失敗しました",
  SIGNUP_FAILED: "新規登録に失敗しました",
  GENERATE_TEXT_FAILED: "テキスト生成に失敗しました",
  CREATE_BET_FAILED: "ベット作成に失敗しました",
  GRAPHQL_ERROR: "GraphQLエラーが発生しました",
  COMPLETE_SIMULATE_FAILED: "シミュレーション完了処理に失敗しました",
  COMPLETE_PLAY_FAILED: "プレイ完了処理に失敗しました",
};
