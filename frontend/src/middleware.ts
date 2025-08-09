import { NextResponse } from "next/server";
import { Session } from "next-auth";

import { auth } from "@/auth";
import { ROUTE, ONE_SECOND_MS } from "@/constants";
import { refreshToken } from "@/lib";
import { isProtectedRoute, isAuthPage } from "@/utils";

import type { NextRequest } from "next/server";

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
