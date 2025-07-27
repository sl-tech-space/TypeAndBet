"use server";

import { signIn } from "@/auth";
import { ERROR_MESSAGE } from "@/constants";
import { AuthService } from "@/graphql";
import "@/lib/apollo-server";

/**
 * オリジナルフォームログイン
 * @param email メールアドレス
 * @param password パスワード
 * @returns ユーザーとトークン
 */
export async function login(email: string, password: string) {
  try {
    const { data } = await AuthService.login(email, password);

    // レスポンスの確認
    if (!data.loginUser.success) {
      if (data.loginUser.errors && data.loginUser.errors.length > 0) {
        return { error: data.loginUser.errors.join("\n") };
      }
      return { error: ERROR_MESSAGE.LOGIN_FAILED };
    }

    // auth.tsのsignInを使用してセッションを作成
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.error(ERROR_MESSAGE.LOGIN_FAILED, error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: ERROR_MESSAGE.UNEXPECTED };
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
) {
  try {
    const { data } = await AuthService.signup(
      name,
      email,
      password,
      passwordConfirmation
    );

    if (!data.registerUser.success) {
      if (data.registerUser.errors && data.registerUser.errors.length > 0) {
        return { error: data.registerUser.errors.join("\n") };
      }
      return { error: ERROR_MESSAGE.SIGNUP_FAILED };
    }

    return { success: true };
  } catch (error) {
    console.error(ERROR_MESSAGE.SIGNUP_FAILED, error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: ERROR_MESSAGE.UNEXPECTED };
  }
}
