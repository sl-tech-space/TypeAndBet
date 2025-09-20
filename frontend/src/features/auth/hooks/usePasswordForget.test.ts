import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PASSWORD_RESET_MESSAGE } from "@/constants";

import { usePasswordForget } from "./usePasswordForget";

// サーバアクションをモック
vi.mock("@/actions/auth", () => ({
  requestPasswordReset: vi.fn(),
}));

// バリデーションフックをモック
vi.mock("./useValidation", () => ({
  useEmailValidation: () => ({
    errors: [],
    validateEmail: vi.fn(() => true),
  }),
}));

// タイマーをモック
vi.useFakeTimers();

describe("usePasswordForget", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  describe("初期状態", () => {
    it("初期状態で正しい値が設定されていること", () => {
      const { result } = renderHook(() => usePasswordForget());

      expect(result.current.email).toBe("");
      expect(result.current.state).toBe("idle");
      expect(result.current.message).toBe("");
      expect(result.current.hasInteracted).toBe(false);
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.emailErrors).toEqual([]);
      expect(typeof result.current.setEmail).toBe("function");
      expect(typeof result.current.handleSubmit).toBe("function");
      expect(typeof result.current.handleEmailChange).toBe("function");
    });
  });

  describe("メールアドレス変更処理", () => {
    it("メールアドレスが正しく設定されること", () => {
      const { result } = renderHook(() => usePasswordForget());

      act(() => {
        result.current.setEmail("test@example.com");
      });

      expect(result.current.email).toBe("test@example.com");
    });

    it("handleEmailChangeでメールアドレスが正しく設定されること", () => {
      const { result } = renderHook(() => usePasswordForget());

      act(() => {
        result.current.handleEmailChange("test@example.com");
      });

      expect(result.current.email).toBe("test@example.com");
      expect(result.current.hasInteracted).toBe(true);
    });

    it("初回のhandleEmailChangeでhasInteractedがtrueになること", () => {
      const { result } = renderHook(() => usePasswordForget());

      expect(result.current.hasInteracted).toBe(false);

      act(() => {
        result.current.handleEmailChange("test@example.com");
      });

      expect(result.current.hasInteracted).toBe(true);
    });
  });

  describe("パスワードリセット要求処理", () => {
    it("正常にパスワードリセット要求が成功すること", async () => {
      const { requestPasswordReset } = await import("@/actions/auth");
      vi.mocked(requestPasswordReset).mockResolvedValue({
        success: true,
        message: "パスワードリセットメールを送信しました",
        error: null,
      });

      const { result } = renderHook(() => usePasswordForget());

      act(() => {
        result.current.setEmail("test@example.com");
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.state).toBe("success");
      expect(result.current.message).toBe(
        "パスワードリセットメールを送信しました"
      );
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isSubmitting).toBe(false);
    });

    it("パスワードリセット要求が失敗した場合にエラー状態になること", async () => {
      const { requestPasswordReset } = await import("@/actions/auth");
      vi.mocked(requestPasswordReset).mockResolvedValue({
        success: false,
        message: null,
        error: "メールアドレスが見つかりません",
      });

      const { result } = renderHook(() => usePasswordForget());

      act(() => {
        result.current.setEmail("test@example.com");
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.state).toBe("error");
      expect(result.current.message).toBe("メールアドレスが見つかりません");
      expect(result.current.isError).toBe(true);
      expect(result.current.isSubmitting).toBe(false);
    });

    it("サーバアクションで例外が発生した場合にエラー状態になること", async () => {
      const { requestPasswordReset } = await import("@/actions/auth");
      vi.mocked(requestPasswordReset).mockRejectedValue(
        new Error("ネットワークエラー")
      );

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { result } = renderHook(() => usePasswordForget());

      act(() => {
        result.current.setEmail("test@example.com");
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.state).toBe("error");
      expect(result.current.message).toBe("ネットワークエラー");
      expect(result.current.isError).toBe(true);
      expect(result.current.isSubmitting).toBe(false);

      expect(consoleSpy).toHaveBeenCalledWith(
        "パスワードリセット要求エラー:",
        new Error("ネットワークエラー")
      );

      consoleSpy.mockRestore();
    });

    it("サーバアクションで例外が発生した場合にデフォルトエラーメッセージが使用されること", async () => {
      const { requestPasswordReset } = await import("@/actions/auth");
      vi.mocked(requestPasswordReset).mockRejectedValue("Unknown error");

      const { result } = renderHook(() => usePasswordForget());

      act(() => {
        result.current.setEmail("test@example.com");
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.state).toBe("error");
      expect(result.current.message).toBe(PASSWORD_RESET_MESSAGE.ERROR_MESSAGE);
      expect(result.current.isError).toBe(true);
    });

    it("サーバアクションで例外が発生した場合にサーバーメッセージが優先されること", async () => {
      const { requestPasswordReset } = await import("@/actions/auth");
      vi.mocked(requestPasswordReset).mockResolvedValue({
        success: true,
        message: null,
        error: null,
      });

      const { result } = renderHook(() => usePasswordForget());

      act(() => {
        result.current.setEmail("test@example.com");
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.state).toBe("success");
      expect(result.current.message).toBe(
        PASSWORD_RESET_MESSAGE.SUCCESS_MESSAGE
      );
      expect(result.current.isSuccess).toBe(true);
    });
  });

  describe("メッセージの自動リセット", () => {
    it("成功状態で10秒後にメッセージが消去されること", async () => {
      const { requestPasswordReset } = await import("@/actions/auth");
      vi.mocked(requestPasswordReset).mockResolvedValue({
        success: true,
        message: "成功しました",
        error: null,
      });

      const { result } = renderHook(() => usePasswordForget());

      act(() => {
        result.current.setEmail("test@example.com");
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.message).toBe("成功しました");

      // 10秒経過
      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(result.current.message).toBe("");
    });

    it("エラー状態で5秒後にメッセージが消去され、状態がidleに戻ること", async () => {
      const { requestPasswordReset } = await import("@/actions/auth");
      vi.mocked(requestPasswordReset).mockResolvedValue({
        success: false,
        message: null,
        error: "エラーが発生しました",
      });

      const { result } = renderHook(() => usePasswordForget());

      act(() => {
        result.current.setEmail("test@example.com");
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.state).toBe("error");
      expect(result.current.message).toBe("エラーが発生しました");

      // 5秒経過
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.message).toBe("");
      expect(result.current.state).toBe("idle");
    });
  });
});
