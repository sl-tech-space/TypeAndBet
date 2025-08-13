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
  | "SIGNUP_EMAIL_SENT"
  | "PLAY"
  | "RESULT"
  | "TERMS"
  | "PRIVACY"
  | "VERIFY_EMAIL"
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
  SIGNUP_EMAIL_SENT: "メール送信完了",
  PLAY: "プレイ",
  RESULT: "結果",
  TERMS: "利用規約",
  PRIVACY: "プライバシーポリシー",
  VERIFY_EMAIL: "メール認証",
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
  SIGNUP_EMAIL_SENT:
    "メール送信完了ページです。メールを確認して、Type&Betを楽しむことができます。",
  PLAY: "Type&Betの本番です。プレイすることで成績を競うことができます。",
  RESULT: "Type&Betの結果ページです。プレイした結果を確認することができます。",
  TERMS: "Type&Betの利用規約ページです。利用規約を確認することができます。",
  PRIVACY:
    "Type&Betのプライバシーポリシーページです。プライバシーポリシーを確認することができます。",
  VERIFY_EMAIL:
    "Type&Betのメール認証ページです。メール認証を行うことで、Type&Betを楽しむことができます。",
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
  SIGNUP_EMAIL_SENT: "Type&Bet, メール送信完了, 新規登録, 認証完了",
  PLAY: "Type&Bet, プレイ, タイピング, ゲーム, 賭け, 競争, ランキング",
  RESULT: "Type&Bet, 結果, タイピング, ゲーム, 賭け, 競争, ランキング",
  TERMS: "Type&Bet, 利用規約, プライバシーポリシー",
  PRIVACY: "Type&Bet, プライバシーポリシー, 利用規約",
  VERIFY_EMAIL: "Type&Bet, メール認証",
  NOT_FOUND: "Type&Bet, ページが見つかりません",
  SERVER_ERROR: "Type&Bet, サーバーエラー",
};
