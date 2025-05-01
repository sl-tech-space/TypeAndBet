import { gql } from "@apollo/client";

export const TOKEN_ALL_FIELDS = gql`
  fragment TokenAllFields on Token {
    accessToken
    refreshToken
    expiresAt
  }
`;
