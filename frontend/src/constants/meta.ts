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
  | "PASSWORD_FORGET"
  | "PASSWORD_RESET"
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
  PASSWORD_FORGET: "パスワードを忘れた",
  PASSWORD_RESET: "パスワードをリセット",
  NOT_FOUND: "ページが見つかりません",
  SERVER_ERROR: "サーバーエラー",
};

/**
 * メタ説明
 */
export const META_DESCRIPTION: MetaInfo = {
  HOME: "Type&Bet(TypeAndBet)はタイピング×ベットの新感覚ゲーム。練習から本番対戦、ランキングまで、遊びながらタイピングを鍛えられます。",
  SIMULATE:
    "Type&Betのシミュレートページです。自分のタイピング力を試すことができます。",
  LOGIN:
    "Type&Betにログインして本番対戦やランキングに参加。TypeAndBetでも検索される新感覚タイピングゲーム。",
  SIGNUP:
    "Type&Bet(TypeAndBet)に無料登録。メール認証で安全に始められるタイピング×ベットゲーム。",
  SIGNUP_EMAIL_SENT:
    "メール送信完了ページです。メールを確認して、Type&Betを楽しんでください。",
  PLAY: "Type&Bet(TypeAndBet)の本番対戦。タイピングの速さ・正確さでベットの結果が変わる刺激的なゲーム体験。",
  RESULT:
    "Type&Bet(TypeAndBet)の対戦結果とスコアを確認。ベット結果やゴールドの変動、ランクアップ状況も把握。",
  TERMS:
    "Type&Bet(TypeAndBet)の利用規約。サービス利用に関する条件を確認できます。",
  PRIVACY:
    "Type&Bet(TypeAndBet)のプライバシーポリシー。個人情報の取り扱い方針を説明します。",
  VERIFY_EMAIL:
    "Type&Bet(TypeAndBet)のメール認証ページ。アカウントを有効化してゲームを開始。",
  PASSWORD_FORGET:
    "Type&Bet(TypeAndBet)のパスワード再設定手続き。メールで安全にリセット。",
  PASSWORD_RESET:
    "Type&Bet(TypeAndBet)のパスワード再設定。新しいパスワードでログインし直せます。",
  NOT_FOUND: "ページが見つかりません",
  SERVER_ERROR: "サーバーエラー",
};

/**
 * メタキーワード
 */
export const META_KEYWORDS: MetaInfo = {
  HOME: "Type&Bet, TypeAndBet, Type And Bet, タイプアンドベット, タイピング ゲーム, タイピング 練習, タイピング 対戦, タイピング ランキング, タイピング eスポーツ, ベット ゲーム, 賭け ゲーム",
  SIMULATE:
    "Type&Bet, シミュレート, タイピング, ゲーム, 賭け, 競争, ランキング",
  LOGIN:
    "Type&Bet, TypeAndBet, ログイン, タイピング, タイピング 対戦, ベット ゲーム, 賭け",
  SIGNUP:
    "Type&Bet, TypeAndBet, 新規登録, サインアップ, タイピング ゲーム, タイピング 練習, ベット",
  SIGNUP_EMAIL_SENT: "Type&Bet, TypeAndBet, メール送信完了, 新規登録, 認証完了",
  PLAY: "Type&Bet, TypeAndBet, タイピング 対戦, タイピング ゲーム, ベット, 賭け, ランキング",
  RESULT:
    "Type&Bet, TypeAndBet, 対戦 結果, タイピング スコア, ベット 結果, ランキング",
  TERMS: "Type&Bet, TypeAndBet, 利用規約, プライバシーポリシー",
  PRIVACY: "Type&Bet, TypeAndBet, プライバシーポリシー, 利用規約",
  VERIFY_EMAIL: "Type&Bet, TypeAndBet, メール認証",
  PASSWORD_FORGET: "Type&Bet, TypeAndBet, パスワードを忘れた",
  PASSWORD_RESET: "Type&Bet, TypeAndBet, パスワードをリセット",
  NOT_FOUND: "Type&Bet, ページが見つかりません",
  SERVER_ERROR: "Type&Bet, サーバーエラー",
};
