import { gql } from "@apollo/client";

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
