/**
 * サイト名の型定義
 */
export const SITE_NAME: string = "Type&Bet";

/**
 * メタ情報のキーの型定義
 */
export type MetaKey = "HOME" | "SIMULATE" | "LOGIN" | "SIGNUP";

/**
 * メタ情報の型定義
 */
export type MetaInfo = {
  [key in MetaKey]: string;
};

/**
 * メタタイトル
 */
export const META_TITLE: MetaInfo = {
  HOME: "ホーム",
  SIMULATE: "シミュレート",
  LOGIN: "ログイン",
  SIGNUP: "新規登録",
};

/**
 * メタ説明
 */
export const META_DESCRIPTION: MetaInfo = {
  HOME: "Type&Betへようこそ！ログインや新規登録、シミュレーションをして、Type&Betを楽しんでください。",
  SIMULATE:
    "Type&Betのシミュレートページです。自分のタイピング力を試すことができます。",
  LOGIN: "ログインページです。ログインすることで、Type&Betを楽しむことができます。",
  SIGNUP: "新規登録ページです。新規登録することで、Type&Betを楽しむことができます。",
};

/**
 * メタキーワード
 */
export const META_KEYWORDS: MetaInfo = {
  HOME: "Type&Bet, ログイン, 新規登録, シミュレーション, ランキング, 競争, 賭け",
  SIMULATE:
    "Type&Bet, シミュレート, タイピング, ゲーム, 賭け, 競争, ランキング",
  LOGIN: "Type&Bet, ログイン, シミュレーション, ランキング, 競争, 賭け",
  SIGNUP: "Type&Bet, 新規登録, シミュレーション, ランキング, 競争, 賭け",
};
