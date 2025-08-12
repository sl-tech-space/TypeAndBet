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
 * ※シミュレートはゲームIDを使用しないためセッションIDを使用
 */
export type GameSessionIdProps = {
  params: {
    sessionId: string;
  };
};

/**
 * ゲームIDプロパティ
 */
export type GameIdProps = {
  params: {
    gameId: string;
  };
};

/**
 * テキスト生成レスポンス
 */
export interface GenerateTextResponse extends Record<string, unknown> {
  getRandomTextPair: {
    success: boolean;
    textPairs: {
      kanji: string;
      hiragana: string;
    }[];
  };
}

/**
 * シミュレーション完了処理レスポンス
 */
export interface CompleteSimulateResponse extends Record<string, unknown> {
  completePractice: {
    success: boolean;
    errors: string[];
    score: number;
    goldChange: number;
  };
}

/**
 * プレイの完了処理レスポンス
 */
export interface CompletePlayResponse extends Record<string, unknown> {
  updateGameScore: {
    game: {
      id: string;
      betGold: number;
      score: number;
      scoreGoldChange: number;
    };
    success: boolean;
    errors: string[];
  };
}

/**
 * ゲーム結果取得レスポンス
 */
export interface GetGameResultResponse extends Record<string, unknown> {
  gameResult: {
    beforeBetGold: number;
    resultGold: number;
    betGold: number;
    scoreGoldChange: number;
    currentRank: number;
    rankChange: number;
    nextRankGold: number;
  };
}
