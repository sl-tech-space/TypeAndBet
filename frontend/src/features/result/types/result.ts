/**
 * ゲーム結果
 */
export type GameResult = {
  success: boolean;
  score: number;
  goldChange: number;
  error?: string;
};
