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
  HOME: "無料のタイピングゲーム「Type&Bet」でタイピング速度と正確性を向上。初心者から上級者まで楽しめるタイピング練習サイト。リアルタイム対戦やランキング機能でタイピングスキルを競い合おう。AI生成の多様な文章で飽きずに練習できる本格的なタイピングゲームです。",
  SIMULATE:
    "タイピング練習モードで、自分のタイピング速度を測定しよう。登録不要で今すぐ無料でタイピング練習が始められます。正確さとスピードを磨いて、タイピングマスターを目指しましょう。AI生成の文章で毎回新鮮な練習体験。",
  LOGIN:
    "Type&Betにログインしてタイピング対戦に参加。他のプレイヤーとランキングで競い合い、タイピングスキルを証明しよう。毎日のタイピング練習で着実にスキルアップ。",
  SIGNUP:
    "Type&Betに無料登録してタイピングゲームを始めよう。メール認証で安全に登録完了。タイピング練習モードから対戦モードまで、充実の機能で楽しくタイピングスキルを向上できます。",
  SIGNUP_EMAIL_SENT:
    "メール送信完了。受信トレイを確認してType&Betの登録を完了し、タイピングゲームを楽しんでください。",
  PLAY: "タイピング対戦モードでリアルタイムに競おう。タイピングの速さと正確さがゴールドやランキングに影響。ベットシステムで緊張感のあるタイピング体験を。",
  RESULT:
    "タイピング対戦の結果を確認。スコア、タイピング速度、正確率をチェック。ランキング順位の変動やゴールド獲得状況も一目で把握できます。",
  TERMS:
    "Type&Betの利用規約。タイピングゲームサービスの利用条件や規約を確認できます。",
  PRIVACY:
    "Type&Betのプライバシーポリシー。個人情報の取り扱いとセキュリティ方針について説明します。",
  VERIFY_EMAIL:
    "メール認証を完了してType&Betのアカウントを有効化。タイピングゲームをすぐに始められます。",
  PASSWORD_FORGET:
    "Type&Betのパスワード再設定。メールでパスワードリセットリンクを送信します。",
  PASSWORD_RESET:
    "新しいパスワードを設定してType&Betにログイン。タイピングゲームを再開しましょう。",
  NOT_FOUND:
    "お探しのページが見つかりません。Type&Betのタイピングゲームトップページに戻る。",
  SERVER_ERROR:
    "サーバーエラーが発生しました。しばらく待ってから再度アクセスしてください。",
};

/**
 * メタキーワード
 */
export const META_KEYWORDS: MetaInfo = {
  HOME: "タイピングゲーム, タイピング練習, タイピング, ブラインドタッチ, タッチタイピング, 無料タイピング, タイピング速度測定, タイピングスキル, タイピング上達, オンラインタイピング, タイピング対戦, タイピングランキング, Type&Bet, TypeAndBet, AI文章生成",
  SIMULATE:
    "タイピング練習, タイピング, 無料タイピング, タイピング速度, タイピング測定, ブラインドタッチ練習, タッチタイピング練習, タイピングトレーニング, タイピングスキル向上, Type&Bet",
  LOGIN:
    "タイピングゲーム ログイン, タイピング対戦, オンラインタイピング, タイピングランキング, Type&Bet ログイン",
  SIGNUP:
    "タイピングゲーム 登録, 無料タイピング 登録, タイピング練習 始める, Type&Bet 新規登録, オンラインタイピング 無料",
  SIGNUP_EMAIL_SENT: "Type&Bet, メール送信完了, 登録確認",
  PLAY: "タイピング対戦, オンラインタイピングゲーム, タイピング競争, リアルタイムタイピング, タイピングバトル, タイピングランキング, Type&Bet 対戦",
  RESULT:
    "タイピング結果, タイピングスコア, タイピング速度, タイピング正確率, タイピング測定結果, Type&Bet 結果",
  TERMS: "Type&Bet, 利用規約, タイピングゲーム 利用規約",
  PRIVACY: "Type&Bet, プライバシーポリシー, 個人情報保護",
  VERIFY_EMAIL: "Type&Bet, メール認証, アカウント認証",
  PASSWORD_FORGET: "Type&Bet, パスワード再設定, パスワードリセット",
  PASSWORD_RESET: "Type&Bet, パスワード変更, 新しいパスワード",
  NOT_FOUND: "404, ページが見つかりません",
  SERVER_ERROR: "500, サーバーエラー",
};
