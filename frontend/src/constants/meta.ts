/**
 * サイト名の型定義
 */
export const SITE_NAME: string = "Type&Bet";

/**
 * メタ情報のキーの型定義
 */
export type MetaKey =
  | "HOME"
  | "SIMULATE"
  | "LOGIN"
  | "SIGNUP"
  | "PLAY"
  | "RESULT"
  | "TERMS"
  | "PRIVACY"
  | "NOT_FOUND"
  | "SERVER_ERROR";

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
  PLAY: "プレイ",
  RESULT: "結果",
  TERMS: "利用規約",
  PRIVACY: "プライバシーポリシー",
  NOT_FOUND: "ページが見つかりません",
  SERVER_ERROR: "サーバーエラー",
};

/**
 * メタ説明
 */
export const META_DESCRIPTION: MetaInfo = {
  HOME: "Type&Betへようこそ！ログインや新規登録、シミュレーションをして、Type&Betを楽しんでください。",
  SIMULATE:
    "Type&Betのシミュレートページです。自分のタイピング力を試すことができます。",
  LOGIN:
    "ログインページです。ログインすることで、Type&Betを楽しむことができます。",
  SIGNUP:
    "新規登録ページです。新規登録することで、Type&Betを楽しむことができます。",
  PLAY: "Type&Betの本番です。プレイすることで成績を競うことができます。",
  RESULT: "Type&Betの結果ページです。プレイした結果を確認することができます。",
  TERMS: "Type&Betの利用規約ページです。利用規約を確認することができます。",
  PRIVACY:
    "Type&Betのプライバシーポリシーページです。プライバシーポリシーを確認することができます。",
  NOT_FOUND: "ページが見つかりません",
  SERVER_ERROR: "サーバーエラー",
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
  PLAY: "Type&Bet, プレイ, タイピング, ゲーム, 賭け, 競争, ランキング",
  RESULT: "Type&Bet, 結果, タイピング, ゲーム, 賭け, 競争, ランキング",
  TERMS: "Type&Bet, 利用規約, プライバシーポリシー",
  PRIVACY: "Type&Bet, プライバシーポリシー, 利用規約",
  NOT_FOUND: "Type&Bet, ページが見つかりません",
  SERVER_ERROR: "Type&Bet, サーバーエラー",
};
