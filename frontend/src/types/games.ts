/**
 * ゲームセッション
 */
export interface GameSession {
  id: string;
  betAmount: number;
  createdAt: number;
  expiresAt: number;
}

/**
 * ゲームセッション作成パラメータ
 */
export type CreateGameSessionParams = {
  betAmount: number;
};

/**
 * ゲームセッションIDプロパティ
 */
export type GameSessionIdProps = {
  params: {
    sessionId: string;
  };
};

/**
 * テキスト生成レスポンス
 */
export interface GenerateTextResponse extends Record<string, unknown> {
  generateText: {
    theme: string;
    category: string;
    pairs: {
      kanji: string;
      hiragana: string;
    }[];
  };
}
