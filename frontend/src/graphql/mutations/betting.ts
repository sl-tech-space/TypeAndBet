import { gql } from "@apollo/client";

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
