import { gql } from "@apollo/client";

/**
 * ベット
 */
export const BET = gql`
  mutation CreateBet($betGold: Int!) {
    createBet(betGold: $betGold) {
      game {
        id
        betGold
      }
      success
      errors
    }
  }
`;
