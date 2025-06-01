"use server";

import { AuthService } from "@/graphql";
import { signIn } from "@/auth";
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
      return { error: "ログインに失敗しました。" };
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
    console.error("ログイン中にエラーが発生:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "予期せぬエラーが発生しました。" };
  }
}
