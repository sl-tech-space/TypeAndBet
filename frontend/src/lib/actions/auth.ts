"use server";

import { signIn } from "@/auth";
import { OAUTH_PROVIDER, ROUTE } from "@/constants";

/**
 * Google認証を行う
 * @returns 認証成功時にはリダイレクト先のパスを返す
 */
export const signInWithGoogle = async (): Promise<void> => {
  await signIn(OAUTH_PROVIDER.GOOGLE, {
    redirectTo: ROUTE.HOME,
  });
};
