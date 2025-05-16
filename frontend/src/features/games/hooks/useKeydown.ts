"use client";

import { useEffect, useCallback } from "react";
import { KeydownEvent } from "./keydown.types";

/**
 * キーダウンイベントのハンドラー
 * キーダウンイベントを受け取り、キーの押されたキーとコードを返す
 */
export const useKeydown = (onKeydown: (event: KeydownEvent) => void) => {
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
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);
};


