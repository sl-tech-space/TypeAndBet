import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refreshToken } from "@/lib/actions/auth";
import { ROUTE, AUTH_PATH } from "@/constants";

// スタートページかチェック
const isStartPage = (pathname: string) => {
  return pathname === ROUTE.HOME;
};

// 認証が必要なパスかチェック
const isProtectedRoute = (pathname: string) => {
  return AUTH_PATH.some(
    ({ href }) => pathname === href || pathname.startsWith(href)
  );
};

// 認証ページかチェック
const isAuthPage = (pathname: string) => {
  return pathname.startsWith(ROUTE.LOGIN) || pathname.startsWith(ROUTE.SIGNUP);
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // セッションチェック
  const session = await auth();

  // 保護されたルートの場合
  if (isProtectedRoute(pathname)) {
    // セッションまたはアクセストークンが存在しない場合はログインページにリダイレクト
    if (!session || !session.accessToken) {
      return NextResponse.redirect(new URL(ROUTE.LOGIN, request.url));
    }

    // トークンエラーがある場合はログアウト
    if (session.error === "RefreshAccessTokenError") {
      return NextResponse.redirect(new URL(ROUTE.LOGIN, request.url));
    }

    // アクセストークンの有効期限チェック
    if (session.expiresAt && Number(session.expiresAt) * 1000 < Date.now()) {
      const success = await refreshToken();
      if (!success) {
        return NextResponse.redirect(new URL(ROUTE.LOGIN, request.url));
      }
    }
  }

  // 認証ページにアクセスで、ログイン済みの場合はホームにリダイレクト
  if (isAuthPage(pathname) && session?.accessToken) {
    return NextResponse.redirect(new URL(ROUTE.HOME, request.url));
  }

  return NextResponse.next();
}
