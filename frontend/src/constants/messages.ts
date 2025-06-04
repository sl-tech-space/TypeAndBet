/**
 * サポーターキャラクターのメッセージ定数
 */

/**
 * パスの型定義
 */
export type PathKey = "/";

export type PathMessages = {
  [key in PathKey]: string;
};

// パスごとのデフォルトメッセージ
export const PATH_DEFAULT_MESSAGES: PathMessages = {
  "/": "Type&Betへようこそピヨ！\nこの世界ではゴールドを賭けてタイピングゲームをプレイするピヨ！\n各モードのボタンにカーソルを当てると説明するピヨ！\nミーをタッチしてくれたら画面上まで案内するピヨ！",
};

/**
 * ゲームモードメッセージの型定義
 */
export type GameModeMessageCategory = "GUEST";
export type GameModeMessageKey = "SIMULATE" | "PLAY";

export type GameModeMessages = {
  [category in GameModeMessageCategory]: {
    [key in GameModeMessageKey]: string;
  };
};

// ゲームモード関連のメッセージ
export const GAME_MODE_MESSAGES: GameModeMessages = {
  GUEST: {
    SIMULATE:
      "Type＆Betモードのシミュレートができるピヨ！\n未ログインでもプレイできるから試してみるピヨ！",
    PLAY: "実際にゴールドをベットして増やしていくモードピヨ！\n全プレイヤーの成績を基準にユーの成績が決まるピヨ！\nログインするとプレイできるピヨ！",
  },
};
