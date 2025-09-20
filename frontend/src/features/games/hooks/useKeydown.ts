"use client";

import { useCallback, useEffect } from "react";

import { KeydownEvent } from "./keydown.types";

/**
 * キーダウンイベントのハンドラー
 * キーダウンイベントを受け取り、キーの押されたキーとコードを返す
 */
export const useKeydown = (onKeydown: (event: KeydownEvent) => void): void => {
  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      onKeydown({
        key: event.key,
        code: event.code,
      });
    },
    [onKeydown]
  );

  useEffect(() => {
    if (typeof globalThis.window !== "undefined") {
      globalThis.window.addEventListener("keydown", handleKeydown);
      return () => {
        globalThis.window.removeEventListener("keydown", handleKeydown);
      };
    }
  }, [handleKeydown]);
};
