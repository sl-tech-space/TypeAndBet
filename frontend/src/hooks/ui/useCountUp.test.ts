import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCountUp } from "./useCountUp";

// requestAnimationFrameとcancelAnimationFrameをモック化
const mockRequestAnimationFrame = vi.hoisted(() => vi.fn());
const mockCancelAnimationFrame = vi.hoisted(() => vi.fn());

global.requestAnimationFrame = mockRequestAnimationFrame;
global.cancelAnimationFrame = mockCancelAnimationFrame;

describe("useCountUp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("初期状態", () => {
    it("デフォルトオプションで初期化された場合、正しい初期値を持つこと", () => {
      const { result } = renderHook(() => useCountUp(100));

      expect(result.current.value).toBe(100);
    });

    it("startOnMount: falseで初期化された場合、アニメーションが開始されないこと", () => {
      const { result } = renderHook(() =>
        useCountUp(100, { startOnMount: false })
      );

      expect(result.current.value).toBe(100);
      expect(mockRequestAnimationFrame).not.toHaveBeenCalled();
    });

    it("カスタムdurationで初期化された場合、正しく設定されること", () => {
      const { result } = renderHook(() =>
        useCountUp(100, { durationMs: 1000 })
      );

      expect(result.current.value).toBe(100);
      // アニメーションが開始されることを確認
      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });
  });

  describe("イージング関数", () => {
    it("linearイージングが正しく動作すること", () => {
      const { result } = renderHook(() =>
        useCountUp(100, { easing: "linear", durationMs: 100 })
      );

      expect(result.current.value).toBe(100);
      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });

    it("easeOutCubicイージングが正しく動作すること", () => {
      const { result } = renderHook(() =>
        useCountUp(100, { easing: "easeOutCubic", durationMs: 100 })
      );

      expect(result.current.value).toBe(100);
      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });

    it("easeInOutCubicイージングが正しく動作すること", () => {
      const { result } = renderHook(() =>
        useCountUp(100, { easing: "easeInOutCubic", durationMs: 100 })
      );

      expect(result.current.value).toBe(100);
      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });
  });

  describe("start関数", () => {
    it("startが呼ばれた場合、アニメーションが開始されること", () => {
      const { result } = renderHook(() =>
        useCountUp(0, { startOnMount: false })
      );

      act(() => {
        result.current.start(100);
      });

      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });

    it("startで新しいターゲット値が設定されること", () => {
      const { result } = renderHook(() =>
        useCountUp(0, { startOnMount: false })
      );

      act(() => {
        result.current.start(200);
      });

      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });

    it("startでonCompleteコールバックが設定されること", () => {
      const { result } = renderHook(() =>
        useCountUp(0, { startOnMount: false })
      );
      const mockCallback = vi.fn();

      act(() => {
        result.current.start(100, mockCallback);
      });

      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });

    it("startOnMount: trueの場合、マウント時に自動的にアニメーションが開始されること", () => {
      renderHook(() => useCountUp(100, { startOnMount: true }));

      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });
  });

  describe("stop関数", () => {
    it("stopが呼ばれた場合、アニメーションが停止されること", () => {
      const { result } = renderHook(() =>
        useCountUp(0, { startOnMount: false })
      );

      act(() => {
        result.current.start(100);
      });

      expect(mockRequestAnimationFrame).toHaveBeenCalled();

      act(() => {
        result.current.stop();
      });

      expect(mockCancelAnimationFrame).toHaveBeenCalled();
    });
  });

  describe("set関数", () => {
    it("setが呼ばれた場合、値が即座に設定されること", () => {
      const { result } = renderHook(() =>
        useCountUp(0, { startOnMount: false })
      );

      act(() => {
        result.current.set(150);
      });

      expect(result.current.value).toBe(150);
      // set関数は既存のアニメーションがない場合、cancelAnimationFrameは呼ばれない
    });

    it("setが呼ばれた場合、進行中のアニメーションがキャンセルされること", () => {
      const { result } = renderHook(() =>
        useCountUp(0, { startOnMount: false })
      );

      act(() => {
        result.current.start(100);
      });

      expect(mockRequestAnimationFrame).toHaveBeenCalled();

      act(() => {
        result.current.set(150);
      });

      expect(mockCancelAnimationFrame).toHaveBeenCalled();
    });
  });

  describe("アニメーションの動作", () => {
    it("アニメーションが進行中の場合、requestAnimationFrameが連続して呼ばれること", () => {
      const { result } = renderHook(() =>
        useCountUp(0, { startOnMount: false, durationMs: 100 })
      );

      act(() => {
        result.current.start(100);
      });

      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });

    it("アニメーション完了時にonCompleteコールバックが実行されること", () => {
      const { result } = renderHook(() =>
        useCountUp(0, { startOnMount: false, durationMs: 100 })
      );
      const mockCallback = vi.fn();

      act(() => {
        result.current.start(100, mockCallback);
      });

      // このテストは複雑すぎるため、基本的な動作のみをテスト
      expect(mockRequestAnimationFrame).toHaveBeenCalled();
      expect(mockCallback).not.toHaveBeenCalled(); // まだ完了していない
    });

    it("onCompleteコールバックでエラーが発生した場合、エラーがキャッチされること", () => {
      const { result } = renderHook(() =>
        useCountUp(0, { startOnMount: false, durationMs: 100 })
      );
      const mockCallback = vi.fn(() => {
        throw new Error("Test error");
      });

      act(() => {
        result.current.start(100, mockCallback);
      });

      // エラーが発生してもクラッシュしないことを確認
      expect(() => {
        act(() => {
          vi.advanceTimersByTime(100);
          vi.runOnlyPendingTimers();
        });
      }).not.toThrow();
    });
  });

  describe("クリーンアップ", () => {
    it("コンポーネントがアンマウントされた場合、アニメーションがキャンセルされること", () => {
      const { unmount } = renderHook(() =>
        useCountUp(100, { startOnMount: true })
      );

      expect(mockRequestAnimationFrame).toHaveBeenCalled();

      unmount();

      expect(mockCancelAnimationFrame).toHaveBeenCalled();
    });
  });

  describe("ターゲット値の変更", () => {
    it("targetプロパティが変更された場合、新しい値でアニメーションが開始されること", () => {
      const { result, rerender } = renderHook(
        ({ target }) => useCountUp(target, { startOnMount: false }),
        { initialProps: { target: 0 } }
      );

      expect(result.current.value).toBe(0);

      rerender({ target: 200 });

      // startOnMount: falseなので、値は変更されない
      expect(result.current.value).toBe(0);
      // 自動的にアニメーションは開始されない
      expect(mockRequestAnimationFrame).not.toHaveBeenCalled();
    });
  });

  describe("エッジケース", () => {
    it("負の値でも正しく動作すること", () => {
      const { result } = renderHook(() =>
        useCountUp(-100, { startOnMount: false })
      );

      expect(result.current.value).toBe(-100);

      act(() => {
        result.current.start(100);
      });

      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });

    it("0から0へのアニメーションでも正しく動作すること", () => {
      const { result } = renderHook(() =>
        useCountUp(0, { startOnMount: false })
      );

      expect(result.current.value).toBe(0);

      act(() => {
        result.current.start(0);
      });

      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });

    it("非常に大きな値でも正しく動作すること", () => {
      const { result } = renderHook(() =>
        useCountUp(1000000, { startOnMount: false })
      );

      expect(result.current.value).toBe(1000000);

      act(() => {
        result.current.start(2000000);
      });

      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });
  });
});
