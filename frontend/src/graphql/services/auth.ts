import {
  GraphQLServerClient,
  GOOGLE_AUTH,
  REFRESH_TOKEN,
  LOGIN,
  SIGNUP,
} from "@/graphql";

import type {
  LoginUserResponse,
  OAuthResponse,
  RefreshTokenResponse,
  SignupUserResponse,
} from "@/types";

/**
 * 認証サービスクラス
 */
export class AuthService {
  /**
   * ログインを行う
   * @param email メールアドレス
   * @param password パスワード
   * @returns
   */
  public static async login(
    client: GraphQLServerClient,
    email: string,
    password: string
  ): Promise<{ data: LoginUserResponse }> {
    const variables = {
      email,
      password,
    };

    return client.executeMutation<LoginUserResponse, typeof variables>(
      LOGIN,
      variables
    );
  }

  /**
   * 新規登録を行う
   * @param name 名前
   * @param email メールアドレス
   * @param password パスワード
   * @param passwordConfirmation パスワード確認
   * @returns
   */
  public static async signup(
    client: GraphQLServerClient,
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ): Promise<{ data: SignupUserResponse }> {
    const variables = {
      name,
      email,
      password,
      passwordConfirm: passwordConfirmation,
    };

    return client.executeMutation<SignupUserResponse, typeof variables>(
      SIGNUP,
      variables
    );
  }

  /**
   * Google認証を行う
   * @param email メールアドレス
   * @param name 名前
   * @param icon アイコン
   * @returns
   */
  public static async googleAuth(
    client: GraphQLServerClient,
    email: string,
    name: string,
    icon?: string
  ): Promise<{ data: OAuthResponse }> {
    const variables = {
      email,
      name,
      ...(icon && { icon }),
    };

    return client.executeMutation<OAuthResponse, typeof variables>(
      GOOGLE_AUTH,
      variables
    );
  }

  /**
   * トークンをリフレッシュ
   * @param refreshToken リフレッシュトークン
   * @returns
   */
  public static async refreshToken(
    client: GraphQLServerClient,
    refreshToken: string
  ): Promise<{ data: RefreshTokenResponse }> {
    return client.executeMutation(REFRESH_TOKEN, { refreshToken });
  }
}
