import { gql } from "@apollo/client";

/**
 * ランキングを取得
 */
export const GET_RANKINGS = gql`
  query GetRankings($limit: Int, $offset: Int) {
    rankings(limit: $limit, offset: $offset) {
      ranking
      name
      icon
      gold
    }
  }
`;
