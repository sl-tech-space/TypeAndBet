import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refreshToken } from "@/lib/actions/auth";
import { AUTH_PATH } from "@/constants";

// スタートページかチェック
const isStartPage = (pathname: string) => {
  return pathname === "/";
};

// 認証が必要なパスかチェック
const isProtectedRoute = (pathname: string) => {
  return AUTH_PATH.some(
    ({ href }) => pathname === href || pathname.startsWith(href)
  );
};

// 認証ページかチェック
const isAuthPage = (pathname: string) => {
  return pathname.startsWith("/auth");
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // セッションチェック
  const session = await auth();

  // 保護されたルートの場合
  if (isProtectedRoute(pathname)) {
    // セッションまたはアクセストークンが存在しない場合はログインページにリダイレクト
    if (!session || !session.accessToken) {
      return NextResponse.redirect(new URL(`/auth/login`, request.url));
    }

    // トークンエラーがある場合はログアウト
    if (session.error === "RefreshAccessTokenError") {
      return NextResponse.redirect(new URL(`/auth/login`, request.url));
    }

    // アクセストークンの有効期限チェック
    if (Number(session.expiresAt) * 1000 < Date.now()) {
      const success = await refreshToken();
      if (!success) {
        return NextResponse.redirect(new URL(`/auth/login`, request.url));
      }
    }
  }

  // 認証ページまたはスタートページの場合で、ログイン済み(セッション+アクセストークンが存在する場合)
  if (
    (isStartPage(pathname) || isAuthPage(pathname)) &&
    session &&
    session.accessToken
  ) {
    return NextResponse.redirect(new URL(`/dashboard`, request.url));
  }

  return NextResponse.next();
}
