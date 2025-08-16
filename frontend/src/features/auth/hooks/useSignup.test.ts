import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSignup } from "./useSignup";

// サーバアクションをモック
vi.mock("@/actions/auth", () => ({
  signup: vi.fn(),
}));

describe("useSignup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("初期状態", () => {
    it("初期状態で正しい値が設定されていること", () => {
      const { result } = renderHook(() => useSignup());

      expect(result.current.isLoading).toBe(false);
      expect(typeof result.current.signup).toBe("function");
    });
  });

  describe("サインアップ処理", () => {
    it("正常にサインアップが成功すること", async () => {
      const { signup: signupAction } = await import("@/actions/auth");
      vi.mocked(signupAction).mockResolvedValue({
        success: true,
        error: null,
      });

      const { result } = renderHook(() => useSignup());

      const signupResult = await act(async () => {
        return await result.current.signup(
          "テストユーザー",
          "test@example.com",
          "password123",
          "password123"
        );
      });

      expect(signupResult.success).toBe(true);
      expect(signupResult.data).toEqual({
        name: "テストユーザー",
        email: "test@example.com",
        passwordLength: 11,
      });
      expect(signupResult.error).toBeUndefined();
    });

    it("サインアップが失敗した場合にエラーメッセージが返されること", async () => {
      const { signup: signupAction } = await import("@/actions/auth");
      vi.mocked(signupAction).mockResolvedValue({
        success: false,
        error: "メールアドレスが既に使用されています",
      });

      const { result } = renderHook(() => useSignup());

      const signupResult = await act(async () => {
        return await result.current.signup(
          "テストユーザー",
          "existing@example.com",
          "password123",
          "password123"
        );
      });

      expect(signupResult.success).toBe(false);
      expect(signupResult.error).toBe("メールアドレスが既に使用されています");
      expect(signupResult.data).toBeUndefined();
    });

    it("サーバアクションで例外が発生した場合にエラーメッセージが返されること", async () => {
      const { signup: signupAction } = await import("@/actions/auth");
      vi.mocked(signupAction).mockRejectedValue(
        new Error("ネットワークエラー")
      );

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { result } = renderHook(() => useSignup());

      const signupResult = await act(async () => {
        return await result.current.signup(
          "テストユーザー",
          "test@example.com",
          "password123",
          "password123"
        );
      });

      expect(signupResult.success).toBe(false);
      expect(signupResult.error).toBe("ネットワークエラー");
      expect(signupResult.data).toBeUndefined();

      expect(consoleSpy).toHaveBeenCalledWith(
        "サインアップエラー:",
        new Error("ネットワークエラー")
      );

      consoleSpy.mockRestore();
    });

    it("サーバアクションがnullを返した場合にエラーメッセージが返されること", async () => {
      const { signup: signupAction } = await import("@/actions/auth");
      vi.mocked(signupAction).mockResolvedValue(null as any);

      const { result } = renderHook(() => useSignup());

      const signupResult = await act(async () => {
        return await result.current.signup(
          "テストユーザー",
          "test@example.com",
          "password123",
          "password123"
        );
      });

      expect(signupResult.success).toBe(false);
      expect(signupResult.error).toBe("サインアップに失敗しました");
      expect(signupResult.data).toBeUndefined();
    });

    it("予期せぬエラーが発生した場合にデフォルトエラーメッセージが返されること", async () => {
      const { signup: signupAction } = await import("@/actions/auth");
      vi.mocked(signupAction).mockResolvedValue({
        success: false,
        error: null,
      });

      const { result } = renderHook(() => useSignup());

      const signupResult = await act(async () => {
        return await result.current.signup(
          "テストユーザー",
          "test@example.com",
          "password123",
          "password123"
        );
      });

      expect(signupResult.success).toBe(false);
      expect(signupResult.error).toBe("予期せぬエラーが発生しました");
      expect(signupResult.data).toBeUndefined();
    });
  });

  // describe("ローディング状態", () => {
  //   it("サインアップ処理中はローディング状態になること", async () => {
  //     const { signup: signupAction } = await import("@/actions/auth");
  //     let resolvePromise: (value: any) => void;
  //     vi.mocked(signupAction).mockImplementation(
  //       () => new Promise((resolve) => {
  //         resolvePromise = resolve;
  //       })
  //     );

  //     const { result } = renderHook(() => useSignup());

  //     expect(result.current.isLoading).toBe(false);

  //     const signupPromise = result.current.signup(
  //       "テストユーザー",
  //       "test@example.com",
  //       "password123",
  //       "password123"
  //     );

  //     // 非同期処理の開始を待つ
  //     await act(async () => {
  //       await new Promise(resolve => setTimeout(resolve, 0));
  //     });

  //     expect(result.current.isLoading).toBe(true);

  //     // 処理を完了させる
  //     resolvePromise!({ success: true, error: null });

  //     await act(async () => {
  //       await signupPromise;
  //     });

  //     expect(result.current.isLoading).toBe(false);
  //   });
  // });
});
