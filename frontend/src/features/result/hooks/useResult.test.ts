import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GAME_MODE_ID } from "@/constants";
import type { GameResult } from "@/features/result/types";
import { useResult } from "./useResult";

// useLoadingフックをモック化
vi.mock("@/hooks", () => ({
  useLoading: vi.fn(),
}));

// fetchをモック化
global.fetch = vi.fn();

describe("useResult", () => {
  const mockWithLoading = vi.fn();
  const mockIsLoading = false;

  const mockGameResult: GameResult = {
    gameType: GAME_MODE_ID.PLAY,
    success: true,
    score: 1000,
    currentRank: 5,
    rankChange: 2,
    nextRankGold: 100,
    beforeBetGold: 500,
    betGold: 50,
    scoreGoldChange: 100,
    resultGold: 550,
  };

  const mockSimulateResult: GameResult = {
    ...mockGameResult,
    gameType: GAME_MODE_ID.SIMULATE,
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    // useLoadingのモックを設定
    const { useLoading } = await import("@/hooks");
    vi.mocked(useLoading).mockReturnValue({
      isLoading: mockIsLoading,
      setIsLoading: vi.fn(),
      withLoading: mockWithLoading,
    });

    // fetchのモックをリセット
    vi.mocked(fetch).mockClear();
  });

  it("初期状態ではresultがnullで、ローディング状態がfalseであること", () => {
    mockWithLoading.mockImplementation((fn) => {
      return () => fn();
    });

    const { result } = renderHook(() => useResult());

    expect(result.current.result).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSimulate).toBe(false);
    expect(result.current.isPlay).toBe(false);
  });

  it("コンポーネントマウント時に結果を取得すること", async () => {
    const mockFetchResponse = {
      json: vi.fn().mockResolvedValue({ result: mockGameResult }),
    };
    vi.mocked(fetch).mockResolvedValue(mockFetchResponse as any);

    mockWithLoading.mockImplementation((fn) => {
      return () => fn();
    });

    const { result } = renderHook(() => useResult());

    // useEffectが実行されるのを待つ
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(fetch).toHaveBeenCalledWith("/api/result");
    expect(result.current.result).toEqual(mockGameResult);
    expect(result.current.isSimulate).toBe(false);
    expect(result.current.isPlay).toBe(true);
  });

  it("シミュレーションモードの結果が正しく判定されること", async () => {
    const mockFetchResponse = {
      json: vi.fn().mockResolvedValue({ result: mockSimulateResult }),
    };
    vi.mocked(fetch).mockResolvedValue(mockFetchResponse as any);

    mockWithLoading.mockImplementation((fn) => {
      return () => fn();
    });

    const { result } = renderHook(() => useResult());

    // useEffectが実行されるのを待つ
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.result).toEqual(mockSimulateResult);
    expect(result.current.isSimulate).toBe(true);
    expect(result.current.isPlay).toBe(false);
  });

  it("fetchでエラーが発生した場合にコンソールにエラーが出力されること", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const mockError = new Error("ネットワークエラー");
    vi.mocked(fetch).mockRejectedValue(mockError);

    mockWithLoading.mockImplementation((fn) => {
      return () => fn();
    });

    const { result } = renderHook(() => useResult());

    // useEffectが実行されるのを待つ
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(console.error).toHaveBeenCalledWith("結果の取得に失敗:", mockError);
    expect(result.current.result).toBe(null);
    expect(result.current.isSimulate).toBe(false);
    expect(result.current.isPlay).toBe(false);

    consoleSpy.mockRestore();
  });

  it("APIレスポンスが空の場合の処理", async () => {
    const mockFetchResponse = {
      json: vi.fn().mockResolvedValue({}),
    };
    vi.mocked(fetch).mockResolvedValue(mockFetchResponse as any);

    mockWithLoading.mockImplementation((fn) => {
      return () => fn();
    });

    const { result } = renderHook(() => useResult());

    // useEffectが実行されるのを待つ
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.result).toBeUndefined();
    expect(result.current.isSimulate).toBe(false);
    expect(result.current.isPlay).toBe(false);
  });

  it("ローディング状態が正しく反映されること", async () => {
    const { useLoading } = await import("@/hooks");
    vi.mocked(useLoading).mockReturnValue({
      isLoading: true,
      setIsLoading: vi.fn(),
      withLoading: mockWithLoading,
    });

    mockWithLoading.mockImplementation((fn) => {
      return () => fn();
    });

    const { result } = renderHook(() => useResult());

    expect(result.current.isLoading).toBe(true);
  });

  it("withLoadingが正しく呼び出されること", async () => {
    mockWithLoading.mockImplementation((fn) => {
      return () => fn();
    });

    renderHook(() => useResult());

    // useEffectが実行されるのを待つ
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockWithLoading).toHaveBeenCalledWith(expect.any(Function));
  });
});
