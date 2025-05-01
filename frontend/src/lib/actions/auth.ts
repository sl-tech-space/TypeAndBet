"use server";

import { signIn, signOut } from "@/auth";
import { OAUTH_PROVIDER } from "@/constants";
import { AuthService } from "@/graphql";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

/**
 * Google認証を行う
 * @returns 認証成功時にはリダイレクト先のパスを返す
 */
export const signInWithGoogle = async () => {
  await signIn(OAUTH_PROVIDER.GOOGLE, {
    redirectTo: `/`,
  });
};

/**
 * ログアウトを行う
 * @returns ログアウト成功時にはリダイレクト先のパスを返す
 */
export const handleSignOut = async () => {
  await signOut({
    redirectTo: `/`,
  });
};

/**
 * トークンを更新する
 * @returns トークン更新成功時にはtrueを返す
 */
export async function refreshToken() {
  try {
    const session = await auth();
    if (!session?.refreshToken) return false;

    const { data } = await AuthService.refreshToken(
      session.refreshToken as string
    );

    if (data?.refreshToken) {
      revalidatePath("/");
      return true;
    }
  } catch (error) {
    console.error("トークン更新に失敗:", error);
    return false;
  }
  return false;
}
