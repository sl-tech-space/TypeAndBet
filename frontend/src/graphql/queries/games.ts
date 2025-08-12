import { gql } from "@apollo/client";

/**
 * ゲーム結果を取得
 */
export const GET_GAME_RESULT = gql`
  query GetGameResult($gameId: UUID!) {
    gameResult(gameId: $gameId) {
      beforeBetGold
      resultGold
      betGold
      scoreGoldChange
      currentRank
      rankChange
      nextRankGold
    }
  }
`;
