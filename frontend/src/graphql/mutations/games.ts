import { gql } from "@apollo/client";

/**
 * テキスト生成
 */
export const GENERATE_TEXT = gql`
  mutation GenerateText {
    generateText {
      theme
      category
      pairs {
        kanji
        hiragana
      }
    }
  }
`;

/**
 * シミュレーション完了処理
 */
export const COMPLETE_SIMULATE = gql`
  mutation CompletePractice($accuracy: Float!, $correctTyped: Int!) {
    completePractice(accuracy: $accuracy, correctTyped: $correctTyped) {
      success
      errors
      score
      goldChange
    }
  }
`;

/**
 * プレイ完了処理
 */
export const COMPLETE_PLAY = gql`
  mutation CompletePlay(
    $gameId: UUID!
    $accuracy: Float!
    $correctTyped: Int!
  ) {
    updateGameScore(
      gameId: $gameId
      accuracy: $accuracy
      correctTyped: $correctTyped
    ) {
      game {
        id
        score
        goldChange
      }
      success
      errors
    }
  }
`;
