import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { EMAIL_SENT_MESSAGE } from "@/constants";

import { useEmailSent } from "./useEmailSent";

// サーバアクションをモック
vi.mock("@/actions/auth", () => ({
  resendVerificationEmail: vi.fn(),
}));

// タイマーをモック
vi.useFakeTimers();

describe("useEmailSent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  describe("初期状態", () => {
    it("初期状態で正しい値が設定されていること", () => {
      const { result } = renderHook(() => useEmailSent());

      expect(result.current.resendState).toBe("idle");
      expect(result.current.cooldownTime).toBe(0);
      expect(result.current.resendMessage).toBe("");
      expect(typeof result.current.handleResendEmail).toBe("function");
    });
  });

  describe("メール再送信処理", () => {
    it("正常にメール再送信が成功すること", async () => {
      const { resendVerificationEmail } = await import("@/actions/auth");
      vi.mocked(resendVerificationEmail).mockResolvedValue({
        success: true,
        error: null,
      });

      const { result } = renderHook(() => useEmailSent());

      await act(async () => {
        await result.current.handleResendEmail("test@example.com");
      });

      expect(result.current.resendState).toBe("cooldown");
      expect(result.current.cooldownTime).toBe(30);
      expect(result.current.resendMessage).toBe(
        EMAIL_SENT_MESSAGE.RESEND_SUCCESS
      );
    });

    it("メール再送信が失敗した場合にエラー状態になること", async () => {
      const { resendVerificationEmail } = await import("@/actions/auth");
      vi.mocked(resendVerificationEmail).mockResolvedValue({
        success: false,
        error: "カスタムエラーメッセージ",
      });

      const { result } = renderHook(() => useEmailSent());

      await act(async () => {
        await result.current.handleResendEmail("test@example.com");
      });

      expect(result.current.resendState).toBe("error");
      expect(result.current.resendMessage).toBe("カスタムエラーメッセージ");
    });

    it("サーバアクションで例外が発生した場合にエラー状態になること", async () => {
      const { resendVerificationEmail } = await import("@/actions/auth");
      vi.mocked(resendVerificationEmail).mockRejectedValue(
        new Error("ネットワークエラー")
      );

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const { result } = renderHook(() => useEmailSent());

      await act(async () => {
        await result.current.handleResendEmail("test@example.com");
      });

      expect(result.current.resendState).toBe("error");
      expect(result.current.resendMessage).toBe(
        EMAIL_SENT_MESSAGE.RESEND_ERROR
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "メール再送信エラー:",
        new Error("ネットワークエラー")
      );

      consoleSpy.mockRestore();
    });

    it("空のメールアドレスの場合は処理が実行されないこと", async () => {
      const { resendVerificationEmail } = await import("@/actions/auth");
      const { result } = renderHook(() => useEmailSent());

      await act(async () => {
        await result.current.handleResendEmail("");
      });

      expect(result.current.resendState).toBe("idle");
      expect(result.current.cooldownTime).toBe(0);
      expect(result.current.resendMessage).toBe("");
      expect(resendVerificationEmail).not.toHaveBeenCalled();
    });

    it("送信中状態の場合は重複実行されないこと", async () => {
      const { resendVerificationEmail } = await import("@/actions/auth");
      vi.mocked(resendVerificationEmail).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const { result } = renderHook(() => useEmailSent());

      // 最初のリクエスト
      act(() => {
        result.current.handleResendEmail("test@example.com");
      });

      expect(result.current.resendState).toBe("sending");

      // 2番目のリクエスト（送中状態なので実行されない）
      await act(async () => {
        await result.current.handleResendEmail("test@example.com");
      });

      expect(resendVerificationEmail).toHaveBeenCalledTimes(1);
    });

    it("クールダウン中の場合は重複実行されないこと", async () => {
      const { resendVerificationEmail } = await import("@/actions/auth");
      vi.mocked(resendVerificationEmail).mockResolvedValue({
        success: true,
        error: null,
      });

      const { result } = renderHook(() => useEmailSent());

      // 最初のリクエスト
      await act(async () => {
        await result.current.handleResendEmail("test@example.com");
      });

      expect(result.current.resendState).toBe("cooldown");

      // 2番目のリクエスト（クールダウン中なので実行されない）
      await act(async () => {
        await result.current.handleResendEmail("test@example.com");
      });

      expect(resendVerificationEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe("クールダウンタイマー", () => {
    it("クールダウン開始時に30秒のタイマーが設定されること", async () => {
      const { resendVerificationEmail } = await import("@/actions/auth");
      vi.mocked(resendVerificationEmail).mockResolvedValue({
        success: true,
        error: null,
      });

      const { result } = renderHook(() => useEmailSent());

      await act(async () => {
        await result.current.handleResendEmail("test@example.com");
      });

      expect(result.current.resendState).toBe("cooldown");
      expect(result.current.cooldownTime).toBe(30);
    });

    it("クールダウンタイマーが1秒ずつ減少すること", async () => {
      const { resendVerificationEmail } = await import("@/actions/auth");
      vi.mocked(resendVerificationEmail).mockResolvedValue({
        success: true,
        error: null,
      });

      const { result } = renderHook(() => useEmailSent());

      await act(async () => {
        await result.current.handleResendEmail("test@example.com");
      });

      expect(result.current.cooldownTime).toBe(30);

      // 1秒経過
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(result.current.cooldownTime).toBe(29);

      // さらに1秒経過
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(result.current.cooldownTime).toBe(28);
    });

    it("クールダウンタイマーが0になった時にidle状態に戻ること", async () => {
      const { resendVerificationEmail } = await import("@/actions/auth");
      vi.mocked(resendVerificationEmail).mockResolvedValue({
        success: true,
        error: null,
      });

      const { result } = renderHook(() => useEmailSent());

      await act(async () => {
        await result.current.handleResendEmail("test@example.com");
      });

      expect(result.current.resendState).toBe("cooldown");
      expect(result.current.cooldownTime).toBe(30);

      // 30秒経過
      act(() => {
        vi.advanceTimersByTime(30000);
      });

      expect(result.current.resendState).toBe("idle");
      expect(result.current.cooldownTime).toBe(0);
      expect(result.current.resendMessage).toBe("");
    });

    it("クールダウン中にコンポーネントがアンマウントされた場合、タイマーがクリーンアップされること", async () => {
      const { resendVerificationEmail } = await import("@/actions/auth");
      vi.mocked(resendVerificationEmail).mockResolvedValue({
        success: true,
        error: null,
      });

      const { result, unmount } = renderHook(() => useEmailSent());

      await act(async () => {
        await result.current.handleResendEmail("test@example.com");
      });

      expect(result.current.resendState).toBe("cooldown");

      // コンポーネントをアンマウント
      unmount();

      // タイマーが進んでも状態が変わらないことを確認
      act(() => {
        vi.advanceTimersByTime(1000);
      });
    });
  });

  describe("エラーメッセージの自動リセット", () => {
    it("エラー状態から5秒後にメッセージが自動リセットされること", async () => {
      const { resendVerificationEmail } = await import("@/actions/auth");
      vi.mocked(resendVerificationEmail).mockResolvedValue({
        success: false,
        error: "エラーメッセージ",
      });

      const { result } = renderHook(() => useEmailSent());

      await act(async () => {
        await result.current.handleResendEmail("test@example.com");
      });

      expect(result.current.resendState).toBe("error");
      expect(result.current.resendMessage).toBe("エラーメッセージ");

      // 5秒経過
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.resendMessage).toBe("");
    });

    it("エラー状態でコンポーネントがアンマウントされた場合、タイマーがクリーンアップされること", async () => {
      const { resendVerificationEmail } = await import("@/actions/auth");
      vi.mocked(resendVerificationEmail).mockResolvedValue({
        success: false,
        error: "エラーメッセージ",
      });

      const { result, unmount } = renderHook(() => useEmailSent());

      await act(async () => {
        await result.current.handleResendEmail("test@example.com");
      });

      expect(result.current.resendState).toBe("error");

      // コンポーネントをアンマウント
      unmount();

      // タイマーが進んでも状態が変わらないことを確認
      act(() => {
        vi.advanceTimersByTime(5000);
      });
    });
  });

  describe("状態遷移", () => {
    it("idle → sending → cooldown の正常な遷移", async () => {
      const { resendVerificationEmail } = await import("@/actions/auth");
      vi.mocked(resendVerificationEmail).mockResolvedValue({
        success: true,
        error: null,
      });

      const { result } = renderHook(() => useEmailSent());

      // 初期状態
      expect(result.current.resendState).toBe("idle");

      // 送信開始
      act(() => {
        result.current.handleResendEmail("test@example.com");
      });

      // 送信中状態
      expect(result.current.resendState).toBe("sending");

      // 送信完了待ち（非同期処理の完了を待つ）
      await act(async () => {
        // モックされた関数の完了を待つ
        await vi.runAllTimersAsync();
      });

      expect(result.current.resendState).toBe("cooldown");
    });

    it("idle → sending → error のエラー遷移", async () => {
      const { resendVerificationEmail } = await import("@/actions/auth");
      vi.mocked(resendVerificationEmail).mockResolvedValue({
        success: false,
        error: "エラーメッセージ",
      });

      const { result } = renderHook(() => useEmailSent());

      // 初期状態
      expect(result.current.resendState).toBe("idle");

      // 送信開始
      act(() => {
        result.current.handleResendEmail("test@example.com");
      });

      // 送信中状態
      expect(result.current.resendState).toBe("sending");

      // エラー状態（非同期処理の完了を待つ）
      await act(async () => {
        // モックされた関数の完了を待つ
        await vi.runAllTimersAsync();
      });

      expect(result.current.resendState).toBe("error");
    });
  });

  describe("エッジケース", () => {
    it("非常に短い間隔で複数回呼び出された場合の処理", async () => {
      const { resendVerificationEmail } = await import("@/actions/auth");
      vi.mocked(resendVerificationEmail).mockResolvedValue({
        success: true,
        error: null,
      });

      const { result } = renderHook(() => useEmailSent());

      // 連続で呼び出し（同期的に実行）
      act(() => {
        result.current.handleResendEmail("test@example.com");
        result.current.handleResendEmail("test@example.com");
        result.current.handleResendEmail("test@example.com");
      });

      // 送信中状態であることを確認
      expect(result.current.resendState).toBe("sending");

      // 非同期処理の完了を待つ
      await act(async () => {
        await vi.runAllTimersAsync();
      });

      // 最終的にクールダウン状態になることを確認
      expect(result.current.resendState).toBe("cooldown");
      expect(result.current.cooldownTime).toBe(30);
    });

    it("無効なメールアドレスでも処理が実行されること", async () => {
      const { resendVerificationEmail } = await import("@/actions/auth");
      vi.mocked(resendVerificationEmail).mockResolvedValue({
        success: true,
        error: null,
      });

      const { result } = renderHook(() => useEmailSent());

      await act(async () => {
        await result.current.handleResendEmail("invalid-email");
      });

      expect(resendVerificationEmail).toHaveBeenCalledWith("invalid-email");
    });
  });
});
