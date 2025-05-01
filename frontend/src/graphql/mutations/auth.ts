import { gql } from "@apollo/client";
import { USER_BASIC_FIELDS, TOKEN_ALL_FIELDS } from "@/graphql/fragments";

/**
 * Google認証
 * @param email メールアドレス
 * @param name 名前
 * @param icon アイコン
 * @returns ユーザーとトークン
 */
export const GOOGLE_AUTH = gql`
  mutation GoogleAuth($email: String!, $name: String!, $icon: String!) {
    googleAuth(email: $email, name: $name, icon: $icon) {
      user {
        ...UserBasicFields
      }
      tokens {
        ...TokenAllFields
      }
    }
  }
  ${USER_BASIC_FIELDS}
  ${TOKEN_ALL_FIELDS}
`;

/**
 * トークンの更新
 * @param refreshToken リフレッシュトークン
 * @returns トークン
 */
export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      ...TokenAllFields
    }
  }
  ${TOKEN_ALL_FIELDS}
`;
