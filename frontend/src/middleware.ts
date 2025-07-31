import { NextResponse } from "next/server";
import { Session } from "next-auth";

import { auth } from "@/auth";
import { ROUTE, AUTH_PATH, ONE_SECOND_MS } from "@/constants";
import { refreshToken } from "@/lib";

import type { NextRequest } from "next/server";



// 認証が必要なパスかチェック
const isProtectedRoute = (pathname: string): boolean => {
  return AUTH_PATH.some(
    ({ href }) => pathname === href || pathname.startsWith(href)
  );
};

// 認証ページかチェック
const isAuthPage = (pathname: string): boolean => {
  return pathname.startsWith(ROUTE.LOGIN) || pathname.startsWith(ROUTE.SIGNUP);
};

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const pathname: string = request.nextUrl.pathname;

  // セッションチェック
  const session: Session | null = await auth();

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
    if (
      session.expiresAt &&
      Number(session.expiresAt) * ONE_SECOND_MS < Date.now()
    ) {
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
