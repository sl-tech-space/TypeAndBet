/**
 * ベット作成レスポンス
 */
export interface CreateBetResponse extends Record<string, unknown> {
  createBet: {
    game: {
      id: string;
      betAmount: number;
    };
    success: boolean;
    errors?: string[];
  };
}
