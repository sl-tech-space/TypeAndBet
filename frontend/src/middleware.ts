import crypto from "crypto";

import { NextRequest, NextResponse } from "next/server";

import type { Session } from "next-auth";

import { auth } from "@/auth";
import { NODE_ENV, ROUTE } from "@/constants";
import { isAuthPage, isProtectedRoute } from "@/utils";

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
    // セッションが存在しない場合はログインページにリダイレクト
    // NextAuth v5ではセッションベースでチェック
    if (!session || !session.user) {
      try {
        const redirectUrl = new URL(ROUTE.LOGIN, request.url);
        return NextResponse.redirect(redirectUrl);
      } catch {
        // フォールバック: 相対パスでリダイレクト
        return NextResponse.redirect(ROUTE.LOGIN);
      }
    }

    // トークンリフレッシュに失敗した場合のみログアウト
    // auth.tsのjwtコールバックで自動的にリフレッシュが試行される
    if (session.error === "RefreshAccessTokenError") {
      try {
        const redirectUrl = new URL(ROUTE.LOGIN, request.url);
        return NextResponse.redirect(redirectUrl);
      } catch {
        return NextResponse.redirect(ROUTE.LOGIN);
      }
    }
  }

  // 認証ページにアクセスで、ログイン済みの場合はホームにリダイレクト
  if (isAuthPage(pathname) && session?.user) {
    try {
      const redirectUrl = new URL(ROUTE.HOME, request.url);
      return NextResponse.redirect(redirectUrl);
    } catch {
      return NextResponse.redirect(ROUTE.HOME);
    }
  }

  return response;
}
