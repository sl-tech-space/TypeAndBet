"use server";

import { signIn } from "@/auth";
import { ERROR_MESSAGE } from "@/constants";
import { AuthService, GraphQLServerClient } from "@/graphql";
import { getAuthorizedServerClient } from "@/lib/apollo-server";

import type { LoginUserResponse, SignupUserResponse } from "@/types";

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

    if (!data.signupUser.success) {
      if (data.signupUser.errors && data.signupUser.errors.length > 0) {
        return { success: false, error: data.signupUser.errors.join("\n") };
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
