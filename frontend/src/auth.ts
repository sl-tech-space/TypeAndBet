import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

import type { Session } from "next-auth";
import { AuthService } from "@/graphql";
import { OAUTH_PROVIDER } from "@/constants";
import type { OAuthResponse, RefreshTokenResponse } from "@/types";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        return credentials as any;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 14 * 24 * 60 * 60, // 14 days
  },
  events: {
    // サインイン時
    async signIn({ user, account }) {
      if (account?.provider === OAUTH_PROVIDER.GOOGLE) {
        try {
          const { data } = await AuthService.googleAuth(
            user.email,
            user.name,
            user.icon
          );

          if (!data) {
            return;
          }

          // userオブジェクトを更新
          Object.assign(user, {
            id: data.user.id,
            accessToken: data.tokens.accessToken,
            refreshToken: data.tokens.refreshToken,
            expiresAt: data.tokens.expiresAt,
            icon: data.user.icon,
          });
        } catch (error) {
          console.error("OAuth認証に失敗:", error);
        }
      }
    },
    // サインアウト時
    async signOut() {
      // クライアントサイドの情報をクリア
      if (typeof window !== "undefined") {
        window.sessionStorage.clear();
        window.localStorage.clear();
      }
    },
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // 初回サインイン時またはユーザー情報更新時
      if (account && user) {
        try {
          const { data } = await AuthService.googleAuth(
            user.email,
            user.name,
            user.icon
          );

          if (!data) {
            throw new Error("OAuth認証に失敗しました");
          }

          // トークン情報を更新
          return {
            ...token,
            id: data.user.id,
            accessToken: data.tokens.accessToken,
            refreshToken: data.tokens.refreshToken,
            expiresAt: data.tokens.expiresAt,
            icon: data.user.icon,
          };
        } catch (error) {
          console.error("OAuth認証に失敗:", error);
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }

      // トークンの有効期限チェック
      if (!token.expiresAt || Date.now() >= Number(token.expiresAt) * 1000) {
        if (!token.refreshToken) {
          return { ...token, error: "RefreshAccessTokenError" };
        }

        try {
          // リフレッシュトークンを使用して新しいアクセストークンを取得
          const { data } = await AuthService.refreshToken(token.refreshToken as string);

          if (data?.refreshToken) {
            return {
              ...token,
              accessToken: data.tokens.accessToken,
              refreshToken: data.tokens.refreshToken,
              expiresAt: data.tokens.expiresAt,
              error: undefined,
            };
          }
        } catch (error) {
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }

      return token;
    },
    /**
     * セッション情報を更新
     * セッションベースでトークンを更新
     * @param session セッション情報
     * @param token トークン情報
     * @returns セッション情報
     */
    async session({ session, token }): Promise<Session> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id?.toString() ?? undefined,
          name: token.name ?? undefined,
          email: token.email ?? undefined,
          icon: token.picture ?? undefined,
        },
        accessToken: token.accessToken as string | undefined,
        refreshToken: token.refreshToken as string | undefined,
        expiresAt: token.expiresAt as number | undefined,
        error: token.error as "RefreshAccessTokenError" | undefined,
      };
    },
  },
});
