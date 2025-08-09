import { GAME_MODE_ID } from "@/constants";

/**
 * ゲーム結果
 */
export type GameResult = {
  gameType: (typeof GAME_MODE_ID)[keyof typeof GAME_MODE_ID];
  success: boolean;
  score: number;
  currentGold?: number;
  goldChange: number;
  currentRank?: number;
  rankChange?: number;
  nextRankGold?: number;
  error?: string;
};
