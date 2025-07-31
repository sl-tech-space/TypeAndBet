import { SITE_NAME } from "@/constants";

/**
 * ゲームモードの型定義
 */
export type GameModeKey = "SIMULATE" | "PLAY";

export type GameMode = {
  [key in GameModeKey]: string;
};

/**
 * ゲームモード
 */
export const GAME_MODE: GameMode = {
  SIMULATE: "シミュレートモード",
  PLAY: `${SITE_NAME}モード`,
};

/**
 * ゲーム制限時間の型定義
 */
export type GameTimeLimitKey = "MIN_TIME" | "TIME_PER_BET";

export type GameTimeLimit = {
  [key in GameTimeLimitKey]: number;
};

/**
 * ゲーム制限時間
 */
export const GAME_TIME_LIMIT: GameTimeLimit = {
  MIN_TIME: 60,
  TIME_PER_BET: 0.2,
};

/**
 * ゲームベット額の型定義
 */
export type GameBetLimitKey = "MIN_BET" | "MAX_BET" | "DEFAULT_BET";

export type GameBetLimit = {
  [key in GameBetLimitKey]: number;
};

/**
 * ゲームベット額
 */
export const GAME_BET_LIMIT: GameBetLimit = {
  MIN_BET: 100,
  MAX_BET: 700,
  DEFAULT_BET: 400,
};

/**
 * ゲームモード識別子の型定義
 */
export type GameModeIdKey = "SIMULATE" | "PLAY";

export type GameModeId = {
  [key in GameModeIdKey]: string;
};

/**
 * ゲームモード識別子
 */
export const GAME_MODE_ID: GameModeId = {
  SIMULATE: "simulate",
  PLAY: "play",
};

/**
 * タイピング判定の型定義
 */
export type TypeJudgeKey = "CORRECT" | "INCORRECT";

export type TypeJudge = {
  [key in TypeJudgeKey]: string;
};

/**
 * タイピング判定
 */
export const TYPE_JUDGE: TypeJudge = {
  CORRECT: "correct",
  INCORRECT: "incorrect",
};

/**
 * タイピングの初期値
 */
export const COUNT_DOWN_TIME: number = 3;
export const INITIAL_VALUE: number = 0;
export const INITIAL_SENTENCE_COUNT: number = 5;
