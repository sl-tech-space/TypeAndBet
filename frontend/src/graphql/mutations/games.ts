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
