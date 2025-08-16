import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ROUTE } from "@/constants";

import { useLogin } from "./useLogin";

// Next.jsのナビゲーションをモック
const mockPush = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// NextAuthをモック
const mockSignIn = vi.hoisted(() => vi.fn());
vi.mock("next-auth/react", () => ({
  signIn: mockSignIn,
}));

// サーバアクションをモック
vi.mock("@/actions/auth", () => ({
  login: vi.fn(),
}));

// window.location.reloadをモック
const mockReload = vi.hoisted(() => vi.fn());
Object.defineProperty(window, "location", {
  value: { reload: mockReload },
  writable: true,
});

// タイマーをモック
vi.useFakeTimers();

describe("useLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    mockPush.mockClear();
    mockSignIn.mockClear();
    mockReload.mockClear();
  });

  describe("初期状態", () => {
    it("初期状態で正しい値が設定されていること", () => {
      const { result } = renderHook(() => useLogin());

      expect(result.current.isLoading).toBe(false);
      expect(typeof result.current.login).toBe("function");
    });
  });

  describe("ログイン処理", () => {
    it("正常にログインが成功すること", async () => {
      const { login: loginAction } = await import("@/actions/auth");
      vi.mocked(loginAction).mockResolvedValue({
        success: true,
        error: null,
      });

      mockSignIn.mockResolvedValue({ ok: true });

      const { result } = renderHook(() => useLogin());

      const loginResult = await act(async () => {
        return await result.current.login("test@example.com", "password");
      });

      expect(loginResult.success).toBe(true);
      expect(loginResult.error).toBeUndefined();
      expect(mockSignIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
        password: "password",
        redirect: false,
      });
      expect(mockPush).toHaveBeenCalledWith(ROUTE.HOME);

      // タイマーを進めてreloadが呼ばれることを確認
      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(mockReload).toHaveBeenCalled();
    });

    it("ログインが失敗した場合にエラーメッセージが返されること", async () => {
      const { login: loginAction } = await import("@/actions/auth");
      vi.mocked(loginAction).mockResolvedValue({
        success: false,
        error: "メールアドレスまたはパスワードが正しくありません",
      });

      const { result } = renderHook(() => useLogin());

      const loginResult = await act(async () => {
        return await result.current.login("test@example.com", "wrongpassword");
      });

      expect(loginResult.success).toBe(false);
      expect(loginResult.error).toBe(
        "メールアドレスまたはパスワードが正しくありません"
      );
      expect(mockSignIn).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("サーバアクションで例外が発生した場合にエラーメッセージが返されること", async () => {
      const { login: loginAction } = await import("@/actions/auth");
      vi.mocked(loginAction).mockRejectedValue(new Error("ネットワークエラー"));

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { result } = renderHook(() => useLogin());

      const loginResult = await act(async () => {
        return await result.current.login("test@example.com", "password");
      });

      expect(loginResult.success).toBe(false);
      expect(loginResult.error).toBe("ログイン処理中にエラーが発生しました。");
      expect(mockSignIn).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();

      expect(consoleSpy).toHaveBeenCalledWith(
        "ログイン処理でエラーが発生:",
        new Error("ネットワークエラー")
      );

      consoleSpy.mockRestore();
    });

    it("サーバアクションがnullを返した場合にエラーメッセージが返されること", async () => {
      const { login: loginAction } = await import("@/actions/auth");
      vi.mocked(loginAction).mockResolvedValue(null as any);

      const { result } = renderHook(() => useLogin());

      const loginResult = await act(async () => {
        return await result.current.login("test@example.com", "password");
      });

      expect(loginResult.success).toBe(false);
      expect(loginResult.error).toBe(
        "ログイン処理に失敗しました。もう一度お試しください。"
      );
      expect(mockSignIn).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  // describe("ローディング状態", () => {
  //   it("ログイン処理中はローディング状態になること", async () => {
  //     const { login: loginAction } = await import("@/actions/auth");
  //     vi.mocked(loginAction).mockImplementation(
  //       () => new Promise((resolve) => setTimeout(() => resolve({ success: true, error: null }), 100))
  //     );

  //     const { result } = renderHook(() => useLogin());

  //     expect(result.current.isLoading).toBe(false);

  //     const loginPromise = result.current.login("test@example.com", "password");

  //     // 非同期処理の開始を待つ
  //     await act(async () => {
  //       await new Promise(resolve => setTimeout(resolve, 0));
  //     });

  //     expect(result.current.isLoading).toBe(true);

  //     await act(async () => {
  //       await loginPromise;
  //     });

  //     expect(result.current.isLoading).toBe(false);
  //   });
  // });
});
