"use server";

import { getToken } from "next-auth/jwt";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { signIn } from "@/auth";
import { NODE_ENV, OAUTH_PROVIDER, ROUTE } from "@/constants";
import { AuthService, GraphQLServerClient } from "@/graphql";
import { getAuthorizedServerClient } from "@/lib/apollo-server";

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
    // トークン情報を取得（セキュリティのため、クライアント側には公開されていない）
    const cookieStore = await cookies();

    // NextAuthのCookie名を環境に応じて設定
    const cookieName =
      process.env.NODE_ENV === NODE_ENV.PRODUCTION
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token";

    const token = await getToken({
      req: { headers: { cookie: cookieStore.toString() } },
      secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
      cookieName, // 明示的にCookie名を指定
    });

    if (!token?.refreshToken) return false;

    const rawClient = await getAuthorizedServerClient();

    const { data } = await AuthService.refreshToken(
      new GraphQLServerClient(rawClient),
      token.refreshToken as string
    );

    if (data?.refreshToken?.success) {
      revalidatePath(ROUTE.HOME);
      return true;
    }
  } catch (error) {
    console.error("トークン更新に失敗:", error);
    return false;
  }
  return false;
}
