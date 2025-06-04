/**
 * ルートの型定義
 */
export type RouteKey =
  | "HOME"
  | "SIMULATE"
  | "PLAY"
  | "LOGIN"
  | "SIGNUP"
  | "PASSWORD_FORGET"
  | "LOGOUT"
  | "TERMS"
  | "PRIVACY"
  | "CONTACT";

export type Routes = {
  [key in RouteKey]: string;
};

/**
 * ルート
 */
export const ROUTE: Routes = {
  HOME: "/",
  SIMULATE: "/simulate",
  PLAY: "/play",
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  PASSWORD_FORGET: "/auth/password-forget",
  LOGOUT: "/auth/logout",
  TERMS: "/terms",
  PRIVACY: "/privacy",
  CONTACT: "/contact",
};

/**
 * ルート名の型定義
 */
export type RouteNameKey = Exclude<RouteKey, "PASSWORD_FORGET">;

export type RouteNames = {
  [key in RouteNameKey]: string;
};

/**
 * ルート名
 */
export const ROUTE_NAME: RouteNames = {
  HOME: "ホーム",
  SIMULATE: "シミュレーション",
  PLAY: "Type&Bet",
  LOGIN: "ログイン",
  SIGNUP: "新規登録",
  LOGOUT: "ログアウト",
  TERMS: "利用規約",
  PRIVACY: "プライバシーポリシー",
  CONTACT: "お問い合わせ",
};

/**
 * ホームバックボタンの型定義
 */
export type HomeBackButtonKey = "TEXT" | "ROUTE";

export type HomeBackButton = {
  [key in HomeBackButtonKey]: string;
};

export const HOME_BACK_BUTTON: HomeBackButton = {
  TEXT: "ホームに戻る",
  ROUTE: "/",
};
