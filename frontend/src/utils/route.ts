import { AUTH_PATH, REVALIDATE_ROUTES, ROUTE } from "@/constants";

// 認証が必要なパスかチェック
export const isProtectedRoute = (pathname: string): boolean => {
  return AUTH_PATH.some(
    ({ href }) => pathname === href || pathname.startsWith(href)
  );
};

// 認証ページかチェック
export const isAuthPage = (pathname: string): boolean => {
  return pathname.startsWith(ROUTE.LOGIN) || pathname.startsWith(ROUTE.SIGNUP);
};

// 再検証ルートかチェック
export const isRevalidateRoute = (pathname: string): boolean => {
  return Object.values(REVALIDATE_ROUTES).some((route) =>
    pathname.startsWith(route)
  );
};
