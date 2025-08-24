import crypto from "crypto";

import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { NODE_ENV, ONE_SECOND_MS, ROUTE } from "@/constants";
import { refreshToken } from "@/lib";
import { isAuthPage, isProtectedRoute } from "@/utils";

import type { Session } from "next-auth";

export const config = {
  runtime: "nodejs",
};

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.next();
  const pathname: string = request.nextUrl.pathname;
  const isDevelopment = process.env.NODE_ENV === NODE_ENV.DEVELOPMENT;

  // nonce をレスポンスヘッダーに追加してフロントで参照できるようにする
  // 開発環境ではnonceを無効化してReact Refreshを有効化
  if (!isDevelopment) {
    // リクエストごとに nonce を生成
    const nonce = crypto.randomBytes(16).toString("base64");

    // CSP ヘッダーに nonce を埋め込む
    response.headers.set(
      "Content-Security-Policy",
      `
      default-src 'self';
      script-src 'self' 'nonce-${nonce}';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data:;
      font-src 'self';
      connect-src 'self';
    `.replace(/\n\s+/g, " ")
    );

    response.headers.set("X-Content-Security-Policy-Nonce", nonce);
  }

  // セッションチェック
  const session: Session | null = await auth();

  // 保護されたルートの場合
  if (isProtectedRoute(pathname)) {
    // セッションまたはアクセストークンが存在しない場合はログインページにリダイレクト
    if (!session || !session.accessToken) {
      try {
        const redirectUrl = new URL(ROUTE.LOGIN, request.url);
        return NextResponse.redirect(redirectUrl);
      } catch (error) {
        // フォールバック: 相対パスでリダイレクト
        return NextResponse.redirect(ROUTE.LOGIN);
      }
    }

    // トークンエラーがある場合はログアウト
    if (session.error === "RefreshAccessTokenError") {
      try {
        const redirectUrl = new URL(ROUTE.LOGIN, request.url);
        return NextResponse.redirect(redirectUrl);
      } catch (error) {
        return NextResponse.redirect(ROUTE.LOGIN);
      }
    }

    // アクセストークンの有効期限チェック
    if (
      session.expiresAt &&
      Number(session.expiresAt) * ONE_SECOND_MS < Date.now()
    ) {
      const success = await refreshToken();
      if (!success) {
        try {
          const redirectUrl = new URL(ROUTE.LOGIN, request.url);
          return NextResponse.redirect(redirectUrl);
        } catch (error) {
          return NextResponse.redirect(ROUTE.LOGIN);
        }
      }
    }
  }

  // 認証ページにアクセスで、ログイン済みの場合はホームにリダイレクト
  if (isAuthPage(pathname) && session?.accessToken) {
    try {
      const redirectUrl = new URL(ROUTE.HOME, request.url);
      return NextResponse.redirect(redirectUrl);
    } catch (error) {
      return NextResponse.redirect(ROUTE.HOME);
    }
  }

  return response;
}
