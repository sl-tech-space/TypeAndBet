import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ROUTE } from "@/constants";
import { useAuthPath } from "./useAuthPath";

// Next.jsのusePathnameをモック化
const mockUsePathname = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({
  usePathname: mockUsePathname,
}));

describe("useAuthPath", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ログイン画面のパスの場合、isLoginScreenがtrueでisSignupScreenがfalseであること", () => {
    mockUsePathname.mockReturnValue(ROUTE.LOGIN);

    const { result } = renderHook(() => useAuthPath());

    expect(result.current.isLoginScreen).toBe(true);
    expect(result.current.isSignupScreen).toBe(false);
  });

  it("サインアップ画面のパスの場合、isLoginScreenがfalseでisSignupScreenがtrueであること", () => {
    mockUsePathname.mockReturnValue(ROUTE.SIGNUP);

    const { result } = renderHook(() => useAuthPath());

    expect(result.current.isLoginScreen).toBe(false);
    expect(result.current.isSignupScreen).toBe(true);
  });

  it("その他のパスの場合、isLoginScreenとisSignupScreenが両方ともfalseであること", () => {
    mockUsePathname.mockReturnValue("/dashboard");

    const { result } = renderHook(() => useAuthPath());

    expect(result.current.isLoginScreen).toBe(false);
    expect(result.current.isSignupScreen).toBe(false);
  });

  it("ルートパスの場合、isLoginScreenとisSignupScreenが両方ともfalseであること", () => {
    mockUsePathname.mockReturnValue("/");

    const { result } = renderHook(() => useAuthPath());

    expect(result.current.isLoginScreen).toBe(false);
    expect(result.current.isSignupScreen).toBe(false);
  });

  it("パスが空文字の場合、isLoginScreenとisSignupScreenが両方ともfalseであること", () => {
    mockUsePathname.mockReturnValue("");

    const { result } = renderHook(() => useAuthPath());

    expect(result.current.isLoginScreen).toBe(false);
    expect(result.current.isSignupScreen).toBe(false);
  });

  it("パスがnullの場合、isLoginScreenとisSignupScreenが両方ともfalseであること", () => {
    mockUsePathname.mockReturnValue(null);

    const { result } = renderHook(() => useAuthPath());

    expect(result.current.isLoginScreen).toBe(false);
    expect(result.current.isSignupScreen).toBe(false);
  });

  it("パスがundefinedの場合、isLoginScreenとisSignupScreenが両方ともfalseであること", () => {
    mockUsePathname.mockReturnValue(undefined);

    const { result } = renderHook(() => useAuthPath());

    expect(result.current.isLoginScreen).toBe(false);
    expect(result.current.isSignupScreen).toBe(false);
  });

  it("パスが正確に一致する場合のみtrueを返すこと", () => {
    // 部分一致でもfalseを返すことを確認
    mockUsePathname.mockReturnValue("/auth/login/extra");

    const { result } = renderHook(() => useAuthPath());

    expect(result.current.isLoginScreen).toBe(false);
    expect(result.current.isSignupScreen).toBe(false);
  });

  it("大文字小文字が異なる場合、falseを返すこと", () => {
    mockUsePathname.mockReturnValue("/AUTH/LOGIN");

    const { result } = renderHook(() => useAuthPath());

    expect(result.current.isLoginScreen).toBe(false);
    expect(result.current.isSignupScreen).toBe(false);
  });

  it("usePathnameが正しく呼び出されること", () => {
    mockUsePathname.mockReturnValue(ROUTE.LOGIN);

    renderHook(() => useAuthPath());

    expect(mockUsePathname).toHaveBeenCalledTimes(1);
  });
});
