import { gql } from "@apollo/client";

/**
 * ユーザー情報を取得
 */
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

/**
 * セッションの所持金を取得
 */
export const GET_USER_GOLD = gql`
  query GetUser($userId: UUID!) {
    userInfo(userId: $userId) {
      gold
    }
  }
`;
