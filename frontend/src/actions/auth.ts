"use server";

import { signIn } from "@/auth";
import { ERROR_MESSAGE } from "@/constants";
import { AuthService, GraphQLServerClient } from "@/graphql";
import { getAuthorizedServerClient } from "@/lib/apollo-server";
import type {
  LoginUserResponse,
  ResendVerificationEmailResponse,
  SignupUserResponse,
  VerifyEmailResponse,
} from "@/types";

/**
 * オリジナルフォームログイン
 * @param email メールアドレス
 * @param password パスワード
 * @returns ユーザーとトークン
 */
export async function login(
  email: string,
  password: string
): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const rawClient = await getAuthorizedServerClient();

    const { data }: { data: LoginUserResponse } = await AuthService.login(
      new GraphQLServerClient(rawClient),
      email,
      password
    );

    // レスポンスの確認
    if (!data.loginUser.success) {
      if (data.loginUser.errors && data.loginUser.errors.length > 0) {
        return { success: false, error: data.loginUser.errors.join("\n") };
      }
      return { success: false, error: ERROR_MESSAGE.LOGIN_FAILED };
    }

    // auth.tsのsignInを使用してセッションを作成
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error(ERROR_MESSAGE.LOGIN_FAILED, error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: ERROR_MESSAGE.UNEXPECTED };
  }
}

/**
 * オリジナルフォーム新規登録
 * @param name 名前
 * @param email メールアドレス
 * @param password パスワード
 * @param passwordConfirmation パスワード確認
 */
export async function signup(
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const rawClient = await getAuthorizedServerClient();

    const { data }: { data: SignupUserResponse } = await AuthService.signup(
      new GraphQLServerClient(rawClient),
      name,
      email,
      password,
      passwordConfirmation
    );

    if (!data.registerUser.success) {
      if (data.registerUser.errors && data.registerUser.errors.length > 0) {
        return { success: false, error: data.registerUser.errors.join("\n") };
      }
      return { success: false, error: ERROR_MESSAGE.SIGNUP_FAILED };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error(ERROR_MESSAGE.SIGNUP_FAILED, error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: ERROR_MESSAGE.UNEXPECTED };
  }
}

/**
 * メールアドレスの確認
 * @param token トークン
 * @returns 成功フラグとエラー
 */
export async function verifyEmail(token: string): Promise<{
  success: boolean;
  message: string | null | undefined;
  error: string | null;
}> {
  try {
    const rawClient = await getAuthorizedServerClient();

    const { data }: { data: VerifyEmailResponse } =
      await AuthService.verifyEmail(new GraphQLServerClient(rawClient), token);

    if (!data.verifyEmail.success) {
      if (data.verifyEmail.errors && data.verifyEmail.errors.length > 0) {
        return {
          success: false,
          message: null,
          error: data.verifyEmail.errors.join("\n"),
        };
      }
      return {
        success: false,
        message: null,
        error: ERROR_MESSAGE.VERIFY_EMAIL_FAILED,
      };
    }

    return { success: true, message: data.verifyEmail.message, error: null };
  } catch (error) {
    console.error(ERROR_MESSAGE.VERIFY_EMAIL_FAILED, error);
    if (error instanceof Error) {
      return { success: false, message: null, error: error.message };
    }
    return { success: false, message: null, error: ERROR_MESSAGE.UNEXPECTED };
  }
}

/**
 * メール確認メールを再送信
 * @param email メールアドレス
 * @returns 成功フラグとエラー
 */
export async function resendVerificationEmail(email: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const rawClient = await getAuthorizedServerClient();

    const { data }: { data: ResendVerificationEmailResponse } =
      await AuthService.resendVerificationEmail(
        new GraphQLServerClient(rawClient),
        email
      );

    if (!data.resendVerificationEmail.success) {
      if (
        data.resendVerificationEmail.errors &&
        data.resendVerificationEmail.errors.length > 0
      ) {
        return {
          success: false,
          error: data.resendVerificationEmail.errors.join("\n"),
        };
      }
      return {
        success: false,
        error: ERROR_MESSAGE.RESEND_VERIFICATION_EMAIL_FAILED,
      };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error(ERROR_MESSAGE.RESEND_VERIFICATION_EMAIL_FAILED, error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: ERROR_MESSAGE.UNEXPECTED };
  }
}
