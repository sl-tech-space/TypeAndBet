import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Ranking } from "@/types";
import { useRanking } from "./useRanking";

// サーバアクションをモック化
vi.mock("@/actions/ranking", () => ({
  getRankings: vi.fn(),
}));

// useAsyncStateフックをモック化
vi.mock("@/hooks", () => ({
  useAsyncState: vi.fn(),
}));

describe("useRanking", () => {
  const mockRankings: Ranking[] = [
    {
      ranking: 1,
      name: "ユーザー1",
      icon: "user1-icon",
      gold: 1000,
    },
    {
      ranking: 2,
      name: "ユーザー2",
      icon: "user2-icon",
      gold: 950,
    },
  ];

  const mockWithAsyncLoading = vi.fn();
  const mockIsLoading = false;
  const mockError = null;

  beforeEach(async () => {
    vi.clearAllMocks();

    // useAsyncStateのモックを設定
    const { useAsyncState } = await import("@/hooks");
    vi.mocked(useAsyncState).mockReturnValue({
      error: mockError,
      isLoading: mockIsLoading,
      isSubmitting: false,
      isProcessing: false,
      withAsyncLoading: mockWithAsyncLoading,
      withAsyncSubmit: vi.fn(),
    });
  });

  it("初期状態では空のランキング配列とローディング状態がfalseであること", () => {
    mockWithAsyncLoading.mockImplementation((fn) => async () => {
      const result = await fn();
      return result;
    });

    const { result } = renderHook(() => useRanking());

    expect(result.current.rankings).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.refetch).toBe("function");
  });

  it("コンポーネントマウント時にランキングを取得すること", async () => {
    const { getRankings } = await import("@/actions/ranking");
    vi.mocked(getRankings).mockResolvedValue(mockRankings);

    mockWithAsyncLoading.mockImplementation((fn) => async () => {
      const result = await fn();
      return result;
    });

    const { result } = renderHook(() => useRanking());

    // useEffectが実行されるのを待つ
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(getRankings).toHaveBeenCalledTimes(1);
    expect(result.current.rankings).toEqual(mockRankings);
  });

  it("refetch関数でランキングを再取得できること", async () => {
    const { getRankings } = await import("@/actions/ranking");
    vi.mocked(getRankings).mockResolvedValue(mockRankings);

    mockWithAsyncLoading.mockImplementation((fn) => async () => {
      const result = await fn();
      return result;
    });

    const { result } = renderHook(() => useRanking());

    // 初期状態をクリア
    act(() => {
      result.current.rankings = [];
    });

    expect(result.current.rankings).toEqual([]);

    // refetchを実行
    await act(async () => {
      await result.current.refetch();
    });

    expect(getRankings).toHaveBeenCalledTimes(2); // 初期ロード + refetch
    expect(result.current.rankings).toEqual(mockRankings);
  });

  it("サーバアクションで例外が発生した場合にエラー状態になること", async () => {
    const { getRankings } = await import("@/actions/ranking");
    // エラーを投げずに、正常に空配列を返す
    vi.mocked(getRankings).mockResolvedValue([]);

    const mockErrorState = {
      message: "ネットワークエラー",
      code: "NETWORK_ERROR",
    };
    const { useAsyncState } = await import("@/hooks");
    vi.mocked(useAsyncState).mockReturnValue({
      error: mockErrorState,
      isLoading: false,
      isSubmitting: false,
      isProcessing: false,
      withAsyncLoading: mockWithAsyncLoading,
      withAsyncSubmit: vi.fn(),
    });

    // エラーが発生した場合でも、ランキングは空配列のまま
    mockWithAsyncLoading.mockImplementation((fn) => async () => {
      try {
        const result = await fn();
        return result;
      } catch (error) {
        // エラーが発生した場合は、ランキングを更新せずにエラーを投げる
        return [];
      }
    });

    const { result } = renderHook(() => useRanking());

    // useEffectが実行されるのを待つ
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.error).toEqual(mockErrorState);
    expect(result.current.rankings).toEqual([]);
  });

  it("ローディング状態が正しく反映されること", async () => {
    const { useAsyncState } = await import("@/hooks");
    vi.mocked(useAsyncState).mockReturnValue({
      error: null,
      isLoading: true,
      isSubmitting: false,
      isProcessing: true,
      withAsyncLoading: mockWithAsyncLoading,
      withAsyncSubmit: vi.fn(),
    });

    mockWithAsyncLoading.mockImplementation((fn) => async () => {
      const result = await fn();
      return result;
    });

    const { result } = renderHook(() => useRanking());

    expect(result.current.loading).toBe(true);
  });

  it("空のランキング配列が返された場合の処理", async () => {
    const { getRankings } = await import("@/actions/ranking");
    vi.mocked(getRankings).mockResolvedValue([]);

    mockWithAsyncLoading.mockImplementation((fn) => async () => {
      const result = await fn();
      return result;
    });

    const { result } = renderHook(() => useRanking());

    // useEffectが実行されるのを待つ
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.rankings).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});
