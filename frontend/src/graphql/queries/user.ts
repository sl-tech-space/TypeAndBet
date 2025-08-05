import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser($id: ID!) {
    userInfo(id: $id) {
      id
      name
      email
      icon
      gold
      createdAt
      updatedAt
    }
  }
`;

// セッションの所持金を更新
export const SESSION_GOLD_UPDATE = gql`
  query GetUser {
    userInfo(userId: $userId) {
      gold
    }
  }
`;
