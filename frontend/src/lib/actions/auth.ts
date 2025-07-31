"use server";

import { revalidatePath } from "next/cache";

import { auth, signIn } from "@/auth";
import { OAUTH_PROVIDER, ROUTE } from "@/constants";
import { AuthService } from "@/graphql";

/**
 * Google認証を行う
 * @returns 認証成功時にはリダイレクト先のパスを返す
 */
export const signInWithGoogle = async (): Promise<void> => {
  await signIn(OAUTH_PROVIDER.GOOGLE, {
    redirectTo: ROUTE.HOME,
  });
};

/**
 * トークンを更新する
 * @returns トークン更新成功時にはtrueを返す
 */
export async function refreshToken(): Promise<boolean> {
  try {
    const session = await auth();
    if (!session?.refreshToken) return false;

    const { data } = await AuthService.refreshToken(
      session.refreshToken as string
    );

    if (data?.refreshToken) {
      revalidatePath(ROUTE.HOME);
      return true;
    }
  } catch (error) {
    console.error("トークン更新に失敗:", error);
    return false;
  }
  return false;
}
