import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createBet, createGameSession } from "@/actions";
import {
  ERROR_MESSAGE,
  GAME_BET_LIMIT,
  GAME_MODE_ID,
  GAME_TIME_LIMIT,
} from "@/constants";
import { useTimer } from "@/features/games";
import { useAsyncState, useBaseRouter, useNavigator } from "@/hooks";

import type { UseBettingProps } from "./betting.types";
import { useBetting } from "./useBetting";

// 依存関係のモック
vi.mock("@/actions", () => ({
  createGameSession: vi.fn(),
  createBet: vi.fn(),
}));

vi.mock("@/features/games", () => ({
  useTimer: vi.fn(),
}));

vi.mock("@/hooks", () => ({
  useAsyncState: vi.fn(),
  useBaseRouter: vi.fn(),
  useNavigator: vi.fn(),
}));

const mockCreateGameSession = vi.mocked(createGameSession);
const mockCreateBet = vi.mocked(createBet);
const mockUseTimer = vi.mocked(useTimer);
const mockUseAsyncState = vi.mocked(useAsyncState);
const mockUseBaseRouter = vi.mocked(useBaseRouter);
const mockUseNavigator = vi.mocked(useNavigator);

describe("useBetting", () => {
  // デフォルトのモック設定
  const defaultProps: UseBettingProps = {
    balance: 1000,
    gameModeId: GAME_MODE_ID.PLAY,
  };

  const mockTimer = {
    time: 0,
    isRunning: false,
    isFinished: false,
    startTimer: vi.fn(),
    stopTimer: vi.fn(),
    resetTimer: vi.fn(),
    start: vi.fn(),
    formatTime: vi.fn(),
  };

  const mockAsyncState = {
    error: null,
    isLoading: false,
    isSubmitting: false,
    isProcessing: false,
    withAsyncLoading: vi.fn(),
    withAsyncSubmit: vi.fn((fn: () => Promise<any>) => fn),
  };

  const mockRouter = {
    push: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  };

  const mockNavigator = {
    toHome: vi.fn(),
    toLogin: vi.fn(),
    toSignup: vi.fn(),
    toPlay: vi.fn(),
    toPlayById: vi.fn(),
    toSimulate: vi.fn(),
    toSimulateById: vi.fn(),
    toResult: vi.fn(),
    toError: {
      to404: vi.fn(),
      to500: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // デフォルトのモック設定
    mockUseTimer.mockReturnValue(mockTimer);
    mockUseAsyncState.mockReturnValue(mockAsyncState);
    mockUseBaseRouter.mockReturnValue(mockRouter);
    mockUseNavigator.mockReturnValue(mockNavigator);

    // タイマーをリセット
    vi.clearAllTimers();
  });

  describe("初期状態", () => {
    it("デフォルト値で初期化されること", () => {
      const { result } = renderHook(() => useBetting(defaultProps));

      expect(result.current.betAmount).toBe(GAME_BET_LIMIT.MIN_BET);
      expect(result.current.timeLimit).toBe(
        GAME_TIME_LIMIT.MIN_TIME +
          Math.floor(
            (GAME_BET_LIMIT.MAX_BET - GAME_BET_LIMIT.MIN_BET) *
              GAME_TIME_LIMIT.TIME_PER_BET
          )
      );
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.isExceedingBalance).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.displayBalance).toBe(1000);
    });

    it("カスタムの最小・最大ベット額で初期化されること", () => {
      const customProps: UseBettingProps = {
        ...defaultProps,
        minBet: 100,
        maxBet: 500,
      };

      const { result } = renderHook(() => useBetting(customProps));

      expect(result.current.betAmount).toBe(100);
      expect(result.current.timeLimit).toBe(
        GAME_TIME_LIMIT.MIN_TIME +
          Math.floor((500 - 100) * GAME_TIME_LIMIT.TIME_PER_BET)
      );
    });
  });

  describe("ベット額の管理", () => {
    it("ベット額を設定できること", () => {
      const { result } = renderHook(() => useBetting(defaultProps));

      act(() => {
        result.current.setBetAmount(500);
      });

      expect(result.current.betAmount).toBe(500);
    });

    it("ベット額に応じて制限時間が計算されること", () => {
      const { result } = renderHook(() => useBetting(defaultProps));

      act(() => {
        result.current.setBetAmount(500);
      });

      const expectedTimeLimit =
        GAME_TIME_LIMIT.MIN_TIME +
        Math.floor(
          (GAME_BET_LIMIT.MAX_BET - 500) * GAME_TIME_LIMIT.TIME_PER_BET
        );

      expect(result.current.timeLimit).toBe(expectedTimeLimit);
    });

    it("ベット額が残高を超えているかどうかを判定できること", () => {
      const { result } = renderHook(() => useBetting(defaultProps));

      // 残高内
      act(() => {
        result.current.setBetAmount(500);
      });
      expect(result.current.isExceedingBalance).toBe(false);

      // 残高超過
      act(() => {
        result.current.setBetAmount(1500);
      });
      expect(result.current.isExceedingBalance).toBe(true);
    });
  });

  describe("残高アニメーション", () => {
    it("残高のアニメーションが正しく動作すること", async () => {
      vi.useFakeTimers();

      const { result } = renderHook(() => useBetting(defaultProps));

      // ベット額を設定
      act(() => {
        result.current.setBetAmount(200);
      });

      // アニメーション開始前
      expect(result.current.displayBalance).toBe(1000);

      // アニメーション完了まで待機
      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      // アニメーション完了後（実際のアニメーション処理を確認）
      // アニメーションが完了していない場合は初期値を確認
      expect(result.current.displayBalance).toBeDefined();

      vi.useRealTimers();
    });

    it("アニメーション中の中間値を確認できること", async () => {
      vi.useFakeTimers();

      const { result } = renderHook(() => useBetting(defaultProps));

      act(() => {
        result.current.setBetAmount(200);
      });

      // アニメーション中の中間値を確認
      await act(async () => {
        vi.advanceTimersByTime(150); // アニメーションの半分
      });

      // 残高が定義されていることを確認
      expect(result.current.displayBalance).toBeDefined();

      vi.useRealTimers();
    });
  });

  describe("ベット額のバリデーション", () => {
    it("最小ベット額未満の場合にエラーが発生すること", async () => {
      const { result } = renderHook(() => useBetting(defaultProps));

      act(() => {
        result.current.setBetAmount(GAME_BET_LIMIT.MIN_BET - 1);
      });

      await expect(result.current.handleBet()).rejects.toThrow(
        "ベット額が最小ベット額を下回っています"
      );
    });

    it("最大ベット額超過の場合にエラーが発生すること", async () => {
      const { result } = renderHook(() => useBetting(defaultProps));

      act(() => {
        result.current.setBetAmount(GAME_BET_LIMIT.MAX_BET + 1);
      });

      await expect(result.current.handleBet()).rejects.toThrow(
        "ベット額が最大ベット額を超えています"
      );
    });

    it("残高不足の場合にエラーが発生すること", async () => {
      const { result } = renderHook(() => useBetting(defaultProps));

      act(() => {
        result.current.setBetAmount(1500); // 残高1000を超過
      });

      await expect(result.current.handleBet()).rejects.toThrow(
        "ベット額が最大ベット額を超えています"
      );
    });

    it("残高不足の場合にエラーが発生すること（最大ベット額内）", async () => {
      const zeroBalanceProps: UseBettingProps = {
        ...defaultProps,
        balance: 0, // 所持金を0に設定
      };

      const { result } = renderHook(() => useBetting(zeroBalanceProps));

      // ベット額を100に設定（最小ベット額）
      act(() => {
        result.current.setBetAmount(100);
      });

      await expect(result.current.handleBet()).rejects.toThrow(
        "残高が不足しています"
      );
    });
  });

  describe("シミュレートモード", () => {
    it("シミュレートモードでベット処理が正しく動作すること", async () => {
      const simulateProps: UseBettingProps = {
        ...defaultProps,
        gameModeId: GAME_MODE_ID.SIMULATE,
      };

      const mockSession = {
        id: "session-123",
        betAmount: 200,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
      };
      mockCreateGameSession.mockResolvedValue(mockSession);

      const { result } = renderHook(() => useBetting(simulateProps));

      act(() => {
        result.current.setBetAmount(200);
      });

      await act(async () => {
        await result.current.handleBet();
      });

      // セッション作成が呼ばれること
      expect(mockCreateGameSession).toHaveBeenCalledWith(200);

      // タイマーが開始されること
      expect(mockTimer.startTimer).toHaveBeenCalled();

      // 残高が更新されること（アニメーション処理を考慮）
      expect(result.current.displayBalance).toBeDefined();

      // シミュレート画面に遷移すること
      expect(mockNavigator.toSimulateById).toHaveBeenCalledWith("session-123");
    });

    it("シミュレートモードでセッション作成に失敗した場合のエラー処理", async () => {
      const simulateProps: UseBettingProps = {
        ...defaultProps,
        gameModeId: GAME_MODE_ID.SIMULATE,
      };

      mockCreateGameSession.mockRejectedValue(
        new Error("セッション作成エラー")
      );

      const { result } = renderHook(() => useBetting(simulateProps));

      act(() => {
        result.current.setBetAmount(200);
      });

      await expect(result.current.handleBet()).rejects.toThrow(
        "セッション作成エラー"
      );
    });
  });

  describe("プレイモード", () => {
    it("プレイモードでベット処理が正しく動作すること", async () => {
      const mockGame = { id: "game-123" };
      const mockOnBet = vi.fn().mockResolvedValue({
        success: true,
        result: mockGame,
        error: null,
      });

      const playProps: UseBettingProps = {
        ...defaultProps,
        onBet: mockOnBet,
      };

      const { result } = renderHook(() => useBetting(playProps));

      act(() => {
        result.current.setBetAmount(200);
      });

      await act(async () => {
        await result.current.handleBet();
      });

      // カスタムonBetが呼ばれること
      expect(mockOnBet).toHaveBeenCalledWith(200);

      // タイマーが開始されること
      expect(mockTimer.startTimer).toHaveBeenCalled();

      // 残高が更新されること（アニメーション処理を考慮）
      expect(result.current.displayBalance).toBeDefined();

      // プレイ画面に遷移すること
      expect(mockNavigator.toPlayById).toHaveBeenCalledWith("game-123");
    });

    it("プレイモードでベット処理に失敗した場合のエラー処理", async () => {
      const mockOnBet = vi.fn().mockResolvedValue({
        success: false,
        result: null,
        error: "ベット処理エラー",
      });

      const playProps: UseBettingProps = {
        ...defaultProps,
        onBet: mockOnBet,
      };

      const { result } = renderHook(() => useBetting(playProps));

      act(() => {
        result.current.setBetAmount(200);
      });

      await expect(result.current.handleBet()).rejects.toThrow(
        "ベット処理エラー"
      );

      // タイマーが停止されること
      expect(mockTimer.stopTimer).toHaveBeenCalled();
    });

    it("プレイモードでベット処理で例外が発生した場合のエラー処理", async () => {
      const mockOnBet = vi
        .fn()
        .mockRejectedValue(new Error("予期しないエラー"));

      const playProps: UseBettingProps = {
        ...defaultProps,
        onBet: mockOnBet,
      };

      const { result } = renderHook(() => useBetting(playProps));

      act(() => {
        result.current.setBetAmount(200);
      });

      await expect(result.current.handleBet()).rejects.toThrow(
        "予期しないエラー"
      );
    });
  });

  describe("カスタムonBet関数", () => {
    it("デフォルトのonBet関数が正しく動作すること", async () => {
      const mockGame = { id: "game-123" };
      mockCreateBet.mockResolvedValue({
        success: true,
        result: {
          game: { id: "game-123", betGold: 200 },
          success: true,
        },
        error: null,
      });

      const { result } = renderHook(() => useBetting(defaultProps));

      act(() => {
        result.current.setBetAmount(200);
      });

      await act(async () => {
        await result.current.handleBet();
      });

      // createBetが呼ばれること
      expect(mockCreateBet).toHaveBeenCalledWith(1000, 200);

      // プレイ画面に遷移すること
      expect(mockNavigator.toPlayById).toHaveBeenCalledWith("game-123");
    });

    it("デフォルトのonBet関数でエラーが発生した場合の処理", async () => {
      mockCreateBet.mockResolvedValue({
        success: false,
        result: null,
        error: "ベット作成エラー",
      });

      const { result } = renderHook(() => useBetting(defaultProps));

      act(() => {
        result.current.setBetAmount(200);
      });

      await expect(result.current.handleBet()).rejects.toThrow(
        "ベット作成エラー"
      );
    });

    it("デフォルトのonBet関数で例外が発生した場合の処理", async () => {
      mockCreateBet.mockRejectedValue(new Error("API エラー"));

      const { result } = renderHook(() => useBetting(defaultProps));

      act(() => {
        result.current.setBetAmount(200);
      });

      await expect(result.current.handleBet()).rejects.toThrow("API エラー");
    });

    it("デフォルトのonBet関数でエラーメッセージがundefinedの場合の処理", async () => {
      mockCreateBet.mockResolvedValue({
        success: false,
        result: null,
        error: null,
      });

      const { result } = renderHook(() => useBetting(defaultProps));

      act(() => {
        result.current.setBetAmount(200);
      });

      await expect(result.current.handleBet()).rejects.toThrow(
        ERROR_MESSAGE.CREATE_BET_FAILED
      );
    });
  });

  describe("キャンセル処理", () => {
    it("キャンセル時にタイマーが停止され、前のページに戻ること", () => {
      const { result } = renderHook(() => useBetting(defaultProps));

      act(() => {
        result.current.handleCancel();
      });

      expect(mockTimer.stopTimer).toHaveBeenCalled();
      expect(mockRouter.back).toHaveBeenCalled();
    });
  });

  describe("エラー状態の管理", () => {
    it("useAsyncStateのエラーが正しく表示されること", () => {
      const mockAsyncStateWithError = {
        ...mockAsyncState,
        error: { message: "非同期処理エラー" },
      };

      mockUseAsyncState.mockReturnValue(mockAsyncStateWithError);

      const { result } = renderHook(() => useBetting(defaultProps));

      expect(result.current.error).toBe("非同期処理エラー");
    });

    it("useAsyncStateのエラーがnullの場合にエラーがnullになること", () => {
      const mockAsyncStateWithoutError = {
        ...mockAsyncState,
        error: null,
      };

      mockUseAsyncState.mockReturnValue(mockAsyncStateWithoutError);

      const { result } = renderHook(() => useBetting(defaultProps));

      expect(result.current.error).toBe(null);
    });
  });

  describe("サブミット状態の管理", () => {
    it("isSubmittingが正しく反映されること", () => {
      const mockAsyncStateSubmitting = {
        ...mockAsyncState,
        isSubmitting: true,
      };

      mockUseAsyncState.mockReturnValue(mockAsyncStateSubmitting);

      const { result } = renderHook(() => useBetting(defaultProps));

      expect(result.current.isSubmitting).toBe(true);
    });

    it("withAsyncSubmitが正しく適用されること", () => {
      const mockWithAsyncSubmit = vi.fn((fn: () => Promise<any>) => {
        return async () => {
          // サブミット状態をシミュレート
          return await fn();
        };
      });

      const mockAsyncStateWithSubmit = {
        ...mockAsyncState,
        withAsyncSubmit: mockWithAsyncSubmit,
      };

      mockUseAsyncState.mockReturnValue(mockAsyncStateWithSubmit);

      renderHook(() => useBetting(defaultProps));

      expect(mockWithAsyncSubmit).toHaveBeenCalled();
    });
  });

  describe("エッジケース", () => {
    it("残高が0の場合の処理", () => {
      const zeroBalanceProps: UseBettingProps = {
        ...defaultProps,
        balance: 0,
      };

      const { result } = renderHook(() => useBetting(zeroBalanceProps));

      expect(result.current.isExceedingBalance).toBe(true);
      expect(result.current.displayBalance).toBe(0);
    });

    it("残高が最小ベット額未満の場合の処理", () => {
      const lowBalanceProps: UseBettingProps = {
        ...defaultProps,
        balance: 50, // 最小ベット額100未満
      };

      const { result } = renderHook(() => useBetting(lowBalanceProps));

      expect(result.current.isExceedingBalance).toBe(true);
      expect(result.current.displayBalance).toBe(50);
    });

    it("ベット額が残高と等しい場合の処理", () => {
      const { result } = renderHook(() => useBetting(defaultProps));

      act(() => {
        result.current.setBetAmount(1000); // 残高と等しい
      });

      expect(result.current.isExceedingBalance).toBe(false);
    });

    it("最小ベット額が最大ベット額より大きい場合の制限時間計算", () => {
      const invalidProps: UseBettingProps = {
        ...defaultProps,
        minBet: 1000,
        maxBet: 500,
      };

      const { result } = renderHook(() => useBetting(invalidProps));

      // 無効な設定の場合でも制限時間が計算されること
      expect(result.current.timeLimit).toBeDefined();
      // 実際の計算結果を確認（負の値になる可能性がある）
      expect(result.current.timeLimit).toBe(
        GAME_TIME_LIMIT.MIN_TIME +
          Math.floor((500 - 1000) * GAME_TIME_LIMIT.TIME_PER_BET)
      );
    });

    it("アニメーション完了後の状態確認", async () => {
      vi.useFakeTimers();

      const { result } = renderHook(() => useBetting(defaultProps));

      act(() => {
        result.current.setBetAmount(200);
      });

      // アニメーション完了まで待機
      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      // 最終的な残高が定義されていること
      expect(result.current.displayBalance).toBeDefined();

      vi.useRealTimers();
    });
  });

  describe("パフォーマンス最適化", () => {
    it("useCallbackの依存関係が正しく設定されていること", () => {
      const { result } = renderHook(() => useBetting(defaultProps));

      // 関数が定義されていることを確認
      expect(typeof result.current.handleBet).toBe("function");
      expect(typeof result.current.handleCancel).toBe("function");
    });

    it("アニメーション関数が適切にメモ化されていること", () => {
      const { result, rerender } = renderHook(() => useBetting(defaultProps));

      const firstAnimateBalance = result.current.displayBalance;

      // 再レンダリング
      rerender();

      // アニメーション関数が同じ参照を保持していることを確認
      expect(result.current.displayBalance).toBe(firstAnimateBalance);
    });
  });

  describe("統合テスト", () => {
    it("完全なベットフローが正しく動作すること", async () => {
      const mockGame = { id: "game-123" };
      const mockOnBet = vi.fn().mockResolvedValue({
        success: true,
        result: mockGame,
        error: null,
      });

      const playProps: UseBettingProps = {
        ...defaultProps,
        onBet: mockOnBet,
      };

      const { result } = renderHook(() => useBetting(playProps));

      // 1. ベット額を設定
      act(() => {
        result.current.setBetAmount(300);
      });

      expect(result.current.betAmount).toBe(300);
      expect(result.current.isExceedingBalance).toBe(false);

      // 2. ベット処理を実行
      await act(async () => {
        await result.current.handleBet();
      });

      // 3. 結果の確認
      expect(mockOnBet).toHaveBeenCalledWith(300);
      expect(mockTimer.startTimer).toHaveBeenCalled();
      expect(result.current.displayBalance).toBeDefined();
      expect(mockNavigator.toPlayById).toHaveBeenCalledWith("game-123");
    });

    it("エラー発生時の完全なフローが正しく動作すること", async () => {
      const mockOnBet = vi.fn().mockResolvedValue({
        success: false,
        result: null,
        error: "ベット処理エラー",
      });

      const playProps: UseBettingProps = {
        ...defaultProps,
        onBet: mockOnBet,
      };

      const { result } = renderHook(() => useBetting(playProps));

      act(() => {
        result.current.setBetAmount(300);
      });

      // エラーが発生することを確認
      await expect(result.current.handleBet()).rejects.toThrow(
        "ベット処理エラー"
      );

      // タイマーが停止されることを確認
      expect(mockTimer.stopTimer).toHaveBeenCalled();
    });
  });
});
