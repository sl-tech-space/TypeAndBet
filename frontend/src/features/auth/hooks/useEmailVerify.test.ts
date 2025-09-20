import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ROUTE } from "@/constants";

import { useEmailVerify } from "./useEmailVerify";

// Next.jsのナビゲーションをモック
const mockReplace = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  useSearchParams: () => mockSearchParams,
}));

// サーバアクションをモック
vi.mock("@/actions/auth", () => ({
  verifyEmail: vi.fn(),
}));

// タイマーをモック
vi.useFakeTimers();

describe("useEmailVerify", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    mockReplace.mockClear();
    // モックの検索パラメータをリセット
    mockSearchParams.delete("token");
  });

  describe("初期状態", () => {
    it("初期状態で正しい値が設定されていること", () => {
      const { result } = renderHook(() => useEmailVerify());

      // useEffectが即座に実行されるため、初期状態は即座に変更される
      // 非同期処理の完了を待つ（タイマーは進めない）
      act(() => {
        // タイマーは進めずに、非同期処理の完了のみ待つ
        vi.runOnlyPendingTimers();
      });

      expect(result.current.verifyState).toBe("error");
      expect(result.current.message).toBe(null);
      expect(result.current.error).toBe("認証トークンが見つかりません");
      expect(result.current.isLoading).toBe(false);
      expect(result.current.countdown).toBe(2); // 最初のタイマーが実行されるため2になる
    });
  });

  describe("トークンなしの場合", () => {
    it("トークンがない場合にエラー状態になり、エラーページにリダイレクトされること", () => {
      const { result } = renderHook(() => useEmailVerify());

      // 非同期処理の完了を待つ（タイマーは進めない）
      act(() => {
        vi.runOnlyPendingTimers();
      });

      expect(result.current.verifyState).toBe("error");
      expect(result.current.error).toBe("認証トークンが見つかりません");
      expect(result.current.isLoading).toBe(false);
      expect(result.current.countdown).toBe(2); // 最初のタイマーが実行されるため2になる

      // 3秒後にリダイレクト
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(mockReplace).toHaveBeenCalledWith(ROUTE.SERVER_ERROR);
    });
  });

  describe("メール認証処理", () => {
    it("正常にメール認証が成功すること", async () => {
      const { verifyEmail } = await import("@/actions/auth");
      vi.mocked(verifyEmail).mockResolvedValue({
        success: true,
        message: "メール認証が完了しました",
        error: null,
      });

      // URLパラメータにトークンがある状態をモック
      mockSearchParams.set("token", "valid-token");

      const { result } = renderHook(() => useEmailVerify());

      // 認証処理の完了を待つ
      await act(async () => {
        // モックされた関数の完了を待つ（タイマーは進めない）
        vi.runOnlyPendingTimers();
      });

      expect(result.current.verifyState).toBe("success");
      expect(result.current.message).toBe("メール認証が完了しました");
      expect(result.current.error).toBe(null);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.countdown).toBe(3);

      // 3秒後にログインページにリダイレクト
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(mockReplace).toHaveBeenCalledWith(ROUTE.LOGIN);
    });

    it("メール認証が失敗した場合にエラー状態になること", async () => {
      const { verifyEmail } = await import("@/actions/auth");
      vi.mocked(verifyEmail).mockResolvedValue({
        success: false,
        message: null,
        error: "認証トークンが無効です",
      });

      // URLパラメータにトークンがある状態をモック
      mockSearchParams.set("token", "invalid-token");

      const { result } = renderHook(() => useEmailVerify());

      // 認証処理の完了を待つ
      await act(async () => {
        // モックされた関数の完了を待つ（タイマーは進めない）
        vi.runOnlyPendingTimers();
      });

      expect(result.current.verifyState).toBe("error");
      expect(result.current.message).toBe(null);
      expect(result.current.error).toBe("認証トークンが無効です");
      expect(result.current.isLoading).toBe(false);
      expect(result.current.countdown).toBe(3);

      // 3秒後にエラーページにリダイレクト
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(mockReplace).toHaveBeenCalledWith(ROUTE.SERVER_ERROR);
    });

    it("サーバアクションで例外が発生した場合にエラー状態になること", async () => {
      const { verifyEmail } = await import("@/actions/auth");
      vi.mocked(verifyEmail).mockRejectedValue(new Error("ネットワークエラー"));

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // URLパラメータにトークンがある状態をモック
      mockSearchParams.set("token", "valid-token");

      const { result } = renderHook(() => useEmailVerify());

      // 認証処理の完了を待つ
      await act(async () => {
        // モックされた関数の完了を待つ（タイマーは進めない）
        vi.runOnlyPendingTimers();
      });

      expect(result.current.verifyState).toBe("error");
      expect(result.current.message).toBe(null);
      expect(result.current.error).toBe("認証処理中にエラーが発生しました");
      expect(result.current.isLoading).toBe(false);
      expect(result.current.countdown).toBe(3);

      expect(consoleSpy).toHaveBeenCalledWith(
        "メール認証エラー:",
        new Error("ネットワークエラー")
      );

      // 3秒後にエラーページにリダイレクト
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(mockReplace).toHaveBeenCalledWith(ROUTE.SERVER_ERROR);

      consoleSpy.mockRestore();
    });
  });

  describe("カウントダウン機能", () => {
    it("カウントダウンが1秒ずつ減少すること", async () => {
      const { verifyEmail } = await import("@/actions/auth");
      vi.mocked(verifyEmail).mockResolvedValue({
        success: true,
        message: "メール認証が完了しました",
        error: null,
      });

      // URLパラメータにトークンがある状態をモック
      mockSearchParams.set("token", "valid-token");

      const { result } = renderHook(() => useEmailVerify());

      // 認証処理の完了を待つ
      await act(async () => {
        // モックされた関数の完了を待つ（タイマーは進めない）
        vi.runOnlyPendingTimers();
      });

      expect(result.current.countdown).toBe(3);

      // 1秒経過
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(result.current.countdown).toBe(2);

      // さらに1秒経過
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(result.current.countdown).toBe(1);

      // 最後の1秒
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(result.current.countdown).toBe(0);
    });

    it("カウントダウン完了時にリダイレクトが実行されること", async () => {
      const { verifyEmail } = await import("@/actions/auth");
      vi.mocked(verifyEmail).mockResolvedValue({
        success: true,
        message: "メール認証が完了しました",
        error: null,
      });

      // URLパラメータにトークンがある状態をモック
      mockSearchParams.set("token", "valid-token");

      const { result } = renderHook(() => useEmailVerify());

      // 認証処理の完了を待つ
      await act(async () => {
        // モックされた関数の完了を待つ（タイマーは進めない）
        vi.runOnlyPendingTimers();
      });

      expect(result.current.countdown).toBe(3);

      // 3秒経過
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(mockReplace).toHaveBeenCalledWith(ROUTE.LOGIN);
    });
  });

  describe("状態遷移", () => {
    it("verifying → success の正常な遷移", async () => {
      const { verifyEmail } = await import("@/actions/auth");
      vi.mocked(verifyEmail).mockResolvedValue({
        success: true,
        message: "メール認証が完了しました",
        error: null,
      });

      // URLパラメータにトークンがある状態をモック
      mockSearchParams.set("token", "valid-token");

      const { result } = renderHook(() => useEmailVerify());

      // 認証処理の完了を待つ
      await act(async () => {
        // モックされた関数の完了を待つ（タイマーは進めない）
        vi.runOnlyPendingTimers();
      });

      // 成功状態
      expect(result.current.verifyState).toBe("success");
      expect(result.current.isLoading).toBe(false);
      expect(result.current.countdown).toBe(3);
    });

    it("verifying → error のエラー遷移", async () => {
      const { verifyEmail } = await import("@/actions/auth");
      vi.mocked(verifyEmail).mockResolvedValue({
        success: false,
        message: null,
        error: "認証トークンが無効です",
      });

      // URLパラメータにトークンがある状態をモック
      mockSearchParams.set("token", "invalid-token");

      const { result } = renderHook(() => useEmailVerify());

      // 認証処理の完了を待つ
      await act(async () => {
        // モックされた関数の完了を待つ（タイマーは進めない）
        vi.runOnlyPendingTimers();
      });

      // エラー状態
      expect(result.current.verifyState).toBe("error");
      expect(result.current.isLoading).toBe(false);
      expect(result.current.countdown).toBe(3);
    });
  });

  describe("エッジケース", () => {
    it("空のトークンの場合は処理が実行されないこと", () => {
      // URLパラメータに空のトークンがある状態をモック
      mockSearchParams.set("token", "");

      const { result } = renderHook(() => useEmailVerify());

      // 非同期処理の完了を待つ（タイマーは進めない）
      act(() => {
        vi.runOnlyPendingTimers();
      });

      expect(result.current.verifyState).toBe("error");
      expect(result.current.error).toBe("認証トークンが見つかりません");
      expect(result.current.isLoading).toBe(false);
    });

    it("コンポーネントがアンマウントされた場合、タイマーがクリーンアップされること", async () => {
      const { verifyEmail } = await import("@/actions/auth");
      vi.mocked(verifyEmail).mockResolvedValue({
        success: true,
        message: "メール認証が完了しました",
        error: null,
      });

      // URLパラメータにトークンがある状態をモック
      mockSearchParams.set("token", "valid-token");

      const { result, unmount } = renderHook(() => useEmailVerify());

      // 認証処理の完了を待つ
      await act(async () => {
        // モックされた関数の完了を待つ（タイマーは進めない）
        vi.runOnlyPendingTimers();
      });

      expect(result.current.countdown).toBe(3);

      // コンポーネントをアンマウント
      unmount();

      // タイマーが進んでもリダイレクトが実行されないことを確認
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(mockReplace).not.toHaveBeenCalled();
    });
  });
});
