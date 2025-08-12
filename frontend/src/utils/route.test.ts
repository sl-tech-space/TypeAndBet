import { ROUTE } from "../constants";
import { isAuthPage, isProtectedRoute, isRevalidateRoute } from "./route";

describe("Route Utils", () => {
  it("isProtectedRoute: 認証が必要なパスかチェック 結果: false", () => {
    expect(isProtectedRoute(ROUTE.HOME)).toBe(false);
  });

  it("isProtectedRoute: 認証が必要なパスかチェック 結果: true", () => {
    expect(isProtectedRoute(ROUTE.PLAY)).toBe(true);
  });

  it("isAuthPage: 認証ページかチェック 結果: false", () => {
    expect(isAuthPage(ROUTE.HOME)).toBe(false);
  });

  it("isAuthPage: 認証ページかチェック 結果: true", () => {
    expect(isAuthPage(ROUTE.LOGIN)).toBe(true);
  });

  it("isRevalidateRoute: 再検証ルートかチェック 結果: false", () => {
    expect(isRevalidateRoute(ROUTE.TERMS)).toBe(false);
  });

  it("isRevalidateRoute: 再検証ルートかチェック 結果: true", () => {
    expect(isRevalidateRoute(ROUTE.SIMULATE)).toBe(true);
  });

  it("isRevalidateRoute: ホームルートは完全一致のみ 結果: true", () => {
    expect(isRevalidateRoute(ROUTE.HOME)).toBe(true);
  });
});
