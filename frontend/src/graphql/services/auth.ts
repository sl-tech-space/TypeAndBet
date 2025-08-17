import {
  GOOGLE_AUTH,
  GraphQLServerClient,
  LOGIN,
  REFRESH_TOKEN,
  REQUEST_PASSWORD_RESET,
  RESEND_VERIFICATION_EMAIL,
  RESET_PASSWORD,
  SIGNUP,
  VERIFY_EMAIL,
} from "@/graphql";
import type {
  LoginUserResponse,
  OAuthResponse,
  RefreshTokenResponse,
  RequestPasswordResetResponse,
  ResendVerificationEmailResponse,
  ResetPasswordResponse,
  SignupUserResponse,
  VerifyEmailResponse,
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
   * メールアドレスの確認
   * @param token トークン
   * @returns
   */
  public static async verifyEmail(
    client: GraphQLServerClient,
    token: string
  ): Promise<{ data: VerifyEmailResponse }> {
    return client.executeMutation(VERIFY_EMAIL, { token });
  }

  /**
   * メール確認メールを再送信
   * @param email メールアドレス
   * @returns
   */
  public static async resendVerificationEmail(
    client: GraphQLServerClient,
    email: string
  ): Promise<{ data: ResendVerificationEmailResponse }> {
    return client.executeMutation(RESEND_VERIFICATION_EMAIL, { email });
  }

  /**
   * パスワードリセット要求
   * @param email メールアドレス
   * @returns 成功フラグとエラー
   */
  public static async requestPasswordReset(
    client: GraphQLServerClient,
    email: string
  ): Promise<{ data: RequestPasswordResetResponse }> {
    return client.executeMutation(REQUEST_PASSWORD_RESET, { email });
  }

  /**
   * パスワードリセット
   * @param token トークン
   * @param password パスワード
   * @param passwordConfirm パスワード確認
   * @returns 成功フラグとエラー
   */
  public static async resetPassword(
    client: GraphQLServerClient,
    token: string,
    password: string,
    passwordConfirm: string
  ): Promise<{ data: ResetPasswordResponse }> {
    const variables = {
      token,
      password,
      passwordConfirm,
    };

    return client.executeMutation<ResetPasswordResponse, typeof variables>(
      RESET_PASSWORD,
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
