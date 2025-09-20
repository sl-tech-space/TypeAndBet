import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { NEW_PASSWORD_MESSAGE, ROUTE } from "@/constants";

import { usePasswordReset } from "./usePasswordReset";

// Next.jsのナビゲーションをモック
const mockPush = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}));

// サーバアクションをモック
vi.mock("@/actions/auth", () => ({
  resetPassword: vi.fn(),
}));

// バリデーションフックをモック
vi.mock("./useValidation", () => ({
  usePasswordValidation: () => ({
    errors: [],
    validatePassword: vi.fn(() => true),
  }),
}));

// タイマーをモック
vi.useFakeTimers();

describe("usePasswordReset", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    mockPush.mockClear();
    // モックの検索パラメータをリセット
    mockSearchParams.delete("token");
  });

  describe("初期状態", () => {
    it("初期状態で正しい値が設定されていること", () => {
      mockSearchParams.set("token", "valid-token");
      const { result } = renderHook(() => usePasswordReset());

      expect(result.current.password).toBe("");
      expect(result.current.passwordConfirm).toBe("");
      expect(result.current.token).toBe("valid-token");
      expect(result.current.state).toBe("idle");
      expect(result.current.message).toBe("");
      expect(result.current.passwordConfirmError).toBe("");
      expect(result.current.hasInteracted).toBe(false);
      expect(result.current.isTokenValid).toBe(true);
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.passwordErrors).toEqual([]);
      expect(typeof result.current.handlePasswordChange).toBe("function");
      expect(typeof result.current.handlePasswordConfirmChange).toBe(
        "function"
      );
      expect(typeof result.current.handleSubmit).toBe("function");
    });
  });

  describe("トークンの検証", () => {
    it("トークンがない場合にエラー状態になること", () => {
      const { result } = renderHook(() => usePasswordReset());

      expect(result.current.isTokenValid).toBe(false);
      expect(result.current.message).toBe(
        NEW_PASSWORD_MESSAGE.INVALID_TOKEN_MESSAGE
      );
      expect(result.current.state).toBe("error");
    });

    it("トークンがある場合に正常状態になること", () => {
      mockSearchParams.set("token", "valid-token");

      const { result } = renderHook(() => usePasswordReset());

      expect(result.current.token).toBe("valid-token");
      expect(result.current.isTokenValid).toBe(true);
      expect(result.current.state).toBe("idle");
    });
  });

  describe("パスワード変更処理", () => {
    it("パスワードが正しく設定されること", () => {
      mockSearchParams.set("token", "valid-token");
      const { result } = renderHook(() => usePasswordReset());

      act(() => {
        result.current.handlePasswordChange("newpassword123");
      });

      expect(result.current.password).toBe("newpassword123");
    });

    it("handlePasswordChangeでhasInteractedがtrueになること", () => {
      mockSearchParams.set("token", "valid-token");
      const { result } = renderHook(() => usePasswordReset());

      expect(result.current.hasInteracted).toBe(false);

      act(() => {
        result.current.handlePasswordChange("newpassword123");
      });

      expect(result.current.hasInteracted).toBe(true);
    });
  });

  describe("パスワード確認変更処理", () => {
    it("パスワード確認が正しく設定されること", () => {
      mockSearchParams.set("token", "valid-token");
      const { result } = renderHook(() => usePasswordReset());

      act(() => {
        result.current.handlePasswordConfirmChange("newpassword123");
      });

      expect(result.current.passwordConfirm).toBe("newpassword123");
    });

    it("パスワード確認でエラーが設定されること", () => {
      mockSearchParams.set("token", "valid-token");
      const { result } = renderHook(() => usePasswordReset());

      act(() => {
        result.current.handlePasswordChange("newpassword123");
      });

      act(() => {
        result.current.handlePasswordConfirmChange("differentpassword");
      });

      expect(result.current.passwordConfirmError).toBe(
        "パスワードが一致しません"
      );
    });

    it("handlePasswordConfirmChangeでhasInteractedがtrueになること", () => {
      mockSearchParams.set("token", "valid-token");
      const { result } = renderHook(() => usePasswordReset());

      expect(result.current.hasInteracted).toBe(false);

      act(() => {
        result.current.handlePasswordConfirmChange("newpassword123");
      });

      expect(result.current.hasInteracted).toBe(true);
    });
  });

  describe("パスワードリセット処理", () => {
    it("正常にパスワードリセットが成功すること", async () => {
      const { resetPassword } = await import("@/actions/auth");
      vi.mocked(resetPassword).mockResolvedValue({
        success: true,
        message: "パスワードが正常にリセットされました",
        error: null,
      });

      mockSearchParams.set("token", "valid-token");
      const { result } = renderHook(() => usePasswordReset());

      act(() => {
        result.current.handlePasswordChange("newpassword123");
        result.current.handlePasswordConfirmChange("newpassword123");
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.state).toBe("success");
      expect(result.current.message).toBe(
        "パスワードが正常にリセットされました"
      );
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isSubmitting).toBe(false);

      // 3秒後にログインページにリダイレクト
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(mockPush).toHaveBeenCalledWith(ROUTE.LOGIN);
    });

    it("パスワードリセットが失敗した場合にエラー状態になること", async () => {
      const { resetPassword } = await import("@/actions/auth");
      vi.mocked(resetPassword).mockResolvedValue({
        success: false,
        message: null,
        error: "パスワードのリセットに失敗しました",
      });

      mockSearchParams.set("token", "valid-token");
      const { result } = renderHook(() => usePasswordReset());

      act(() => {
        result.current.handlePasswordChange("newpassword123");
        result.current.handlePasswordConfirmChange("newpassword123");
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.state).toBe("error");
      expect(result.current.message).toBe("パスワードのリセットに失敗しました");
      expect(result.current.isError).toBe(true);
      expect(result.current.isSubmitting).toBe(false);
    });

    it("サーバアクションで例外が発生した場合にエラー状態になること", async () => {
      const { resetPassword } = await import("@/actions/auth");
      vi.mocked(resetPassword).mockRejectedValue(
        new Error("ネットワークエラー")
      );

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockSearchParams.set("token", "valid-token");
      const { result } = renderHook(() => usePasswordReset());

      act(() => {
        result.current.handlePasswordChange("newpassword123");
        result.current.handlePasswordConfirmChange("newpassword123");
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.state).toBe("error");
      expect(result.current.message).toBe("ネットワークエラー");
      expect(result.current.isError).toBe(true);
      expect(result.current.isSubmitting).toBe(false);

      expect(consoleSpy).toHaveBeenCalledWith(
        "パスワードリセットエラー:",
        new Error("ネットワークエラー")
      );

      consoleSpy.mockRestore();
    });

    it("無効なトークンの場合に特別なエラーメッセージが表示されること", async () => {
      const { resetPassword } = await import("@/actions/auth");
      vi.mocked(resetPassword).mockResolvedValue({
        success: false,
        message: null,
        error: "無効なトークンです",
      });

      mockSearchParams.set("token", "invalid-token");
      const { result } = renderHook(() => usePasswordReset());

      act(() => {
        result.current.handlePasswordChange("newpassword123");
        result.current.handlePasswordConfirmChange("newpassword123");
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.isTokenValid).toBe(false);
      expect(result.current.message).toBe(
        NEW_PASSWORD_MESSAGE.INVALID_TOKEN_MESSAGE
      );
    });

    it("期限切れトークンの場合に特別なエラーメッセージが表示されること", async () => {
      const { resetPassword } = await import("@/actions/auth");
      vi.mocked(resetPassword).mockResolvedValue({
        success: false,
        message: null,
        error: "期限切れのトークンです",
      });

      mockSearchParams.set("token", "expired-token");
      const { result } = renderHook(() => usePasswordReset());

      act(() => {
        result.current.handlePasswordChange("newpassword123");
        result.current.handlePasswordConfirmChange("newpassword123");
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.isTokenValid).toBe(false);
      expect(result.current.message).toBe(
        NEW_PASSWORD_MESSAGE.EXPIRED_TOKEN_MESSAGE
      );
    });
  });

  describe("エラーメッセージの自動リセット", () => {
    it("エラー状態で5秒後にメッセージが消去され、状態がidleに戻ること", async () => {
      const { resetPassword } = await import("@/actions/auth");
      vi.mocked(resetPassword).mockResolvedValue({
        success: false,
        message: null,
        error: "エラーが発生しました",
      });

      mockSearchParams.set("token", "valid-token");
      const { result } = renderHook(() => usePasswordReset());

      act(() => {
        result.current.handlePasswordChange("newpassword123");
        result.current.handlePasswordConfirmChange("newpassword123");
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
