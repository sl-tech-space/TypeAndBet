import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useTimer } from "./useTimer";

// Zustandストアのモック
vi.mock("@/features/games/stores", () => ({
  useTimerStore: vi.fn(),
}));

const mockUseTimerStore = vi.mocked(
  await import("@/features/games/stores")
).useTimerStore;

describe("useTimer", () => {
  const mockStore = {
    time: 0,
    isRunning: false,
    isFinished: false,
    startTimer: vi.fn(),
    stopTimer: vi.fn(),
    resetTimer: vi.fn(),
    start: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTimerStore.mockReturnValue(mockStore);
  });

  it("ストアからタイマーの状態と関数を返すこと", () => {
    const { result } = renderHook(() => useTimer());

    expect(result.current.time).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.isFinished).toBe(false);
    expect(result.current.startTimer).toBe(mockStore.startTimer);
    expect(result.current.stopTimer).toBe(mockStore.stopTimer);
    expect(result.current.resetTimer).toBe(mockStore.resetTimer);
    expect(result.current.start).toBe(mockStore.start);
  });

  describe("formatTime", () => {
    it("秒数をmm:ss形式にフォーマットすること", () => {
      const { result } = renderHook(() => useTimer());

      expect(result.current.formatTime(0)).toBe("0:00");
      expect(result.current.formatTime(30)).toBe("0:30");
      expect(result.current.formatTime(60)).toBe("1:00");
      expect(result.current.formatTime(90)).toBe("1:30");
      expect(result.current.formatTime(125)).toBe("2:05");
      expect(result.current.formatTime(3600)).toBe("60:00");
    });

    it("1桁の秒数を0でパディングすること", () => {
      const { result } = renderHook(() => useTimer());

      expect(result.current.formatTime(1)).toBe("0:01");
      expect(result.current.formatTime(61)).toBe("1:01");
      expect(result.current.formatTime(3599)).toBe("59:59");
    });

    it("負の値を適切に処理すること", () => {
      const { result } = renderHook(() => useTimer());

      expect(result.current.formatTime(-30)).toBe("-0:30");
      expect(result.current.formatTime(-60)).toBe("-1:00");
    });
  });

  it("呼び出された時にストアの関数を実行すること", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.startTimer(120);
    });
    expect(mockStore.startTimer).toHaveBeenCalledWith(120);

    act(() => {
      result.current.stopTimer();
    });
    expect(mockStore.stopTimer).toHaveBeenCalled();

    act(() => {
      result.current.resetTimer();
    });
    expect(mockStore.resetTimer).toHaveBeenCalled();

    act(() => {
      result.current.start();
    });
    expect(mockStore.start).toHaveBeenCalled();
  });

  it("ストアの状態が変更された時に更新されること", () => {
    const { result, rerender } = renderHook(() => useTimer());

    // 初期状態
    expect(result.current.time).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.isFinished).toBe(false);

    // ストアの状態を変更
    mockUseTimerStore.mockReturnValue({
      ...mockStore,
      time: 45,
      isRunning: true,
      isFinished: false,
    });

    rerender();

    expect(result.current.time).toBe(45);
    expect(result.current.isRunning).toBe(true);
    expect(result.current.isFinished).toBe(false);
  });

  it("ストアの状態遷移を適切に処理すること", () => {
    const { result, rerender } = renderHook(() => useTimer());

    // 開始状態
    mockUseTimerStore.mockReturnValue({
      ...mockStore,
      time: 0,
      isRunning: false,
      isFinished: false,
    });
    rerender();
    expect(result.current.isRunning).toBe(false);

    // 実行中状態
    mockUseTimerStore.mockReturnValue({
      ...mockStore,
      time: 30,
      isRunning: true,
      isFinished: false,
    });
    rerender();
    expect(result.current.isRunning).toBe(true);
    expect(result.current.time).toBe(30);

    // 完了状態
    mockUseTimerStore.mockReturnValue({
      ...mockStore,
      time: 120,
      isRunning: false,
      isFinished: true,
    });
    rerender();
    expect(result.current.isFinished).toBe(true);
    expect(result.current.isRunning).toBe(false);
  });
});
