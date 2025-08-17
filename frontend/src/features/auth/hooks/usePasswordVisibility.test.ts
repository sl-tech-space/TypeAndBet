import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { usePasswordVisibility } from "./usePasswordVisibility";

describe("usePasswordVisibility", () => {
  beforeEach(() => {
    // テストの前の状態をリセット
  });

  describe("初期状態", () => {
    it("初期状態で正しい値が設定されていること", () => {
      const { result } = renderHook(() => usePasswordVisibility());

      expect(result.current.isVisible).toBe(false);
      expect(result.current.inputType).toBe("password");
      expect(typeof result.current.toggleVisibility).toBe("function");
    });
  });

  describe("パスワード表示切り替え", () => {
    it("toggleVisibilityでパスワードが表示されること", () => {
      const { result } = renderHook(() => usePasswordVisibility());

      expect(result.current.isVisible).toBe(false);
      expect(result.current.inputType).toBe("password");

      act(() => {
        result.current.toggleVisibility();
      });

      expect(result.current.isVisible).toBe(true);
      expect(result.current.inputType).toBe("text");
    });

    it("toggleVisibilityでパスワードが非表示になること", () => {
      const { result } = renderHook(() => usePasswordVisibility());

      // 最初に表示状態にする
      act(() => {
        result.current.toggleVisibility();
      });

      expect(result.current.isVisible).toBe(true);
      expect(result.current.inputType).toBe("text");

      // 再度切り替えて非表示にする
      act(() => {
        result.current.toggleVisibility();
      });

      expect(result.current.isVisible).toBe(false);
      expect(result.current.inputType).toBe("password");
    });

    it("複数回の切り替えが正しく動作すること", () => {
      const { result } = renderHook(() => usePasswordVisibility());

      expect(result.current.isVisible).toBe(false);

      // 1回目の切り替え
      act(() => {
        result.current.toggleVisibility();
      });
      expect(result.current.isVisible).toBe(true);

      // 2回目の切り替え
      act(() => {
        result.current.toggleVisibility();
      });
      expect(result.current.isVisible).toBe(false);

      // 3回目の切り替え
      act(() => {
        result.current.toggleVisibility();
      });
      expect(result.current.isVisible).toBe(true);

      // 4回目の切り替え
      act(() => {
        result.current.toggleVisibility();
      });
      expect(result.current.isVisible).toBe(false);
    });
  });

  describe("inputTypeの状態", () => {
    it("isVisibleがfalseの時、inputTypeがpasswordになること", () => {
      const { result } = renderHook(() => usePasswordVisibility());

      expect(result.current.isVisible).toBe(false);
      expect(result.current.inputType).toBe("password");
    });

    it("isVisibleがtrueの時、inputTypeがtextになること", () => {
      const { result } = renderHook(() => usePasswordVisibility());

      act(() => {
        result.current.toggleVisibility();
      });

      expect(result.current.isVisible).toBe(true);
      expect(result.current.inputType).toBe("text");
    });

    it("inputTypeが正しい型で返されること", () => {
      const { result } = renderHook(() => usePasswordVisibility());

      // 初期状態
      expect(typeof result.current.inputType).toBe("string");
      expect(result.current.inputType).toBe("password");

      // 表示状態
      act(() => {
        result.current.toggleVisibility();
      });

      expect(typeof result.current.inputType).toBe("string");
      expect(result.current.inputType).toBe("text");
    });
  });

  describe("状態の独立性", () => {
    it("複数のフックインスタンスが独立して動作すること", () => {
      const { result: result1 } = renderHook(() => usePasswordVisibility());
      const { result: result2 } = renderHook(() => usePasswordVisibility());

      // 両方とも初期状態
      expect(result1.current.isVisible).toBe(false);
      expect(result2.current.isVisible).toBe(false);

      // 1つ目のフックのみ切り替え
      act(() => {
        result1.current.toggleVisibility();
      });

      // 1つ目は変更される
      expect(result1.current.isVisible).toBe(true);
      expect(result1.current.inputType).toBe("text");

      // 2つ目は変更されない
      expect(result2.current.isVisible).toBe(false);
      expect(result2.current.inputType).toBe("password");
    });
  });
});
