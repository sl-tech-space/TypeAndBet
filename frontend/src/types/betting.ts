/**
 * ベット作成レスポンス
 */
export interface CreateBetResponse extends Record<string, unknown> {
  createBet: {
    game: {
      id: string;
      betGold: number;
    };
    success: boolean;
    errors?: string[];
  };
}
