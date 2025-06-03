import { gql } from "@apollo/client";

/**
 * ログイン
 * @param email メールアドレス
 * @param password パスワード
 * @returns ユーザーとトークン
 */
export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      success
      errors
      user {
        id
        name
        email
        icon
        gold
      }
      tokens {
        accessToken
        refreshToken
        expiresAt
      }
    }
  }
`;

/**
 * 新規登録
 * @param name 名前
 * @param email メールアドレス
 * @param password パスワード
 * @param passwordConfirm パスワード確認
 * @returns 成功フラグとエラーとユーザー情報
 */
export const SIGNUP = gql`
  mutation Signup(
    $name: String!
    $email: String!
    $password: String!
    $passwordConfirm: String!
  ) {
    registerUser(
      name: $name
      email: $email
      password: $password
      passwordConfirm: $passwordConfirm
    ) {
      success
      errors
    }
  }
`;

/**
 * Google認証
 * @param email メールアドレス
 * @param name 名前
 * @param icon アイコン（オプショナル）
 * @returns ユーザーとトークン
 */
export const GOOGLE_AUTH = gql`
  mutation GoogleAuth($email: String!, $name: String!, $icon: String) {
    googleAuth(email: $email, name: $name, icon: $icon) {
      user {
        id
        name
        email
        icon
        gold
      }
      tokens {
        accessToken
        refreshToken
        expiresAt
      }
    }
  }
`;

/**
 * トークンの更新
 * @param refreshToken リフレッシュトークン
 * @returns トークン
 */
export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
      expiresAt
    }
  }
`;
