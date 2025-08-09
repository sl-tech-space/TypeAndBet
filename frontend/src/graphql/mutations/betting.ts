import { gql } from "@apollo/client";

/**
 * ベット
 */
export const BET = gql`
  mutation Bet($betAmount: Int!) {
    createBet(betAmount: $betAmount) {
      game {
        id
        betAmount
      }
      success
      errors
    }
  }
`;
