import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { useKeydown } from "./useKeydown";

import type { KeydownEvent } from "./keydown.types";

describe("useKeydown", () => {
  let mockAddEventListener: any;
  let mockRemoveEventListener: any;
  let mockCallback: any;

  beforeEach(() => {
    mockCallback = vi.fn();
    mockAddEventListener = vi.spyOn(window, "addEventListener");
    mockRemoveEventListener = vi.spyOn(window, "removeEventListener");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should add keydown event listener on mount", () => {
    renderHook(() => useKeydown(mockCallback));

    expect(mockAddEventListener).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
  });

  it("should remove keydown event listener on unmount", () => {
    const { unmount } = renderHook(() => useKeydown(mockCallback));

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
  });

  it("should call callback with correct event data when key is pressed", () => {
    renderHook(() => useKeydown(mockCallback));

    // イベントリスナーを取得
    const eventListener = mockAddEventListener.mock.calls[0][1];

    // キーボードイベントをシミュレート
    const mockEvent = {
      key: "a",
      code: "KeyA",
    } as KeyboardEvent;

    eventListener(mockEvent);

    expect(mockCallback).toHaveBeenCalledWith({
      key: "a",
      code: "KeyA",
    } as KeydownEvent);
  });

  it("should handle different key types", () => {
    renderHook(() => useKeydown(mockCallback));

    const eventListener = mockAddEventListener.mock.calls[0][1];

    // 文字キー
    const letterEvent = {
      key: "Enter",
      code: "Enter",
    } as KeyboardEvent;
    eventListener(letterEvent);

    expect(mockCallback).toHaveBeenCalledWith({
      key: "Enter",
      code: "Enter",
    } as KeydownEvent);

    // 数字キー
    const numberEvent = {
      key: "1",
      code: "Digit1",
    } as KeyboardEvent;
    eventListener(numberEvent);

    expect(mockCallback).toHaveBeenCalledWith({
      key: "1",
      code: "Digit1",
    } as KeydownEvent);

    // 特殊キー
    const specialEvent = {
      key: "Shift",
      code: "ShiftLeft",
    } as KeyboardEvent;
    eventListener(specialEvent);

    expect(mockCallback).toHaveBeenCalledWith({
      key: "Shift",
      code: "ShiftLeft",
    } as KeydownEvent);
  });

  it("should handle empty string and null values", () => {
    renderHook(() => useKeydown(mockCallback));

    const eventListener = mockAddEventListener.mock.calls[0][1];

    // 空文字のキー
    const emptyKeyEvent = {
      key: "",
      code: "",
    } as KeyboardEvent;
    eventListener(emptyKeyEvent);

    expect(mockCallback).toHaveBeenCalledWith({
      key: "",
      code: "",
    } as KeydownEvent);

    // 空文字のキー（nullの代わり）
    const emptyKeyEvent2 = {
      key: "",
      code: "",
    } as KeyboardEvent;
    eventListener(emptyKeyEvent2);

    expect(mockCallback).toHaveBeenCalledWith({
      key: "",
      code: "",
    } as KeydownEvent);
  });

  it("should handle multiple keydown events", () => {
    renderHook(() => useKeydown(mockCallback));

    const eventListener = mockAddEventListener.mock.calls[0][1];

    // 複数のキーイベントを連続で発生
    const events = [
      { key: "h", code: "KeyH" },
      { key: "e", code: "KeyE" },
      { key: "l", code: "KeyL" },
      { key: "l", code: "KeyL" },
      { key: "o", code: "KeyO" },
    ];

    events.forEach((event) => {
      eventListener(event as KeyboardEvent);
    });

    expect(mockCallback).toHaveBeenCalledTimes(5);
    expect(mockCallback).toHaveBeenNthCalledWith(1, {
      key: "h",
      code: "KeyH",
    } as KeydownEvent);
    expect(mockCallback).toHaveBeenNthCalledWith(5, {
      key: "o",
      code: "KeyO",
    } as KeydownEvent);
  });

  it("should maintain callback reference between renders", () => {
    const { rerender } = renderHook(() => useKeydown(mockCallback));

    const firstCallCount = mockAddEventListener.mock.calls.length;
    const firstEventListener = mockAddEventListener.mock.calls[0][1];

    // 再レンダリング
    rerender();

    // イベントリスナーが再登録されていないことを確認
    expect(mockAddEventListener.mock.calls.length).toBe(firstCallCount);

    // 同じイベントリスナーが使用されていることを確認
    const secondEventListener = mockAddEventListener.mock.calls[0][1];
    expect(secondEventListener).toBe(firstEventListener);
  });

  it("should handle callback changes", () => {
    const firstCallback = vi.fn();
    const { rerender } = renderHook(({ callback }) => useKeydown(callback), {
      initialProps: { callback: firstCallback },
    });

    const secondCallback = vi.fn();
    rerender({ callback: secondCallback });

    // 新しいコールバックでイベントリスナーが再登録される
    expect(mockAddEventListener.mock.calls.length).toBe(2);

    // 新しいイベントリスナーを取得
    const newEventListener = mockAddEventListener.mock.calls[1][1];

    // 新しいコールバックが呼ばれることを確認
    const mockEvent = {
      key: "a",
      code: "KeyA",
    } as KeyboardEvent;

    newEventListener(mockEvent);

    expect(secondCallback).toHaveBeenCalledWith({
      key: "a",
      code: "KeyA",
    } as KeydownEvent);
    expect(firstCallback).not.toHaveBeenCalled();
  });

  it("should handle window object not available", () => {
    // windowオブジェクトを一時的に無効化
    (global as any).deleteWindow();

    // エラーが発生しないことを確認
    expect(() => {
      renderHook(() => useKeydown(mockCallback));
    }).not.toThrow();

    // windowオブジェクトを復元
    (global as any).restoreWindow();
  });
});
