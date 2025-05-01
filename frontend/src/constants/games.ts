import { SITE_NAME } from "@/constants";

/**
 * ゲームモード
 */
export const GAME_MODES = {
  SIMULATE: "シミュレートモード",
  PLAY: `${SITE_NAME}モード`,
};

/**
 * ゲーム制限時間
 */
export const GAME_TIME_LIMIT = {
  MIN_TIME: 60,
  TIME_PER_BET: 0.2,
};

/**
 * ゲームベット額
 */
export const GAME_BET_LIMIT = {
  MIN_BET: 100,
  MAX_BET: 700,
  DEFAULT_BET: 400,
};
/**
 * ゲームモード識別子
 */
export const GAME_MODE_ID = {
  SIMULATE: "simulate",
  PLAY: "play",
};

