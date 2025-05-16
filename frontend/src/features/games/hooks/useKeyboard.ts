"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  KeyboardState,
  KeyboardHandlers,
} from "../components/TypingCard/InputKeyboard/InputKeyboard.types";
import type { KeydownEvent } from "./keydown.types";
import { TYPE_JUDGE } from "@/constants";

export const useKeyboard = () => {
  const [state, setState] = useState<KeyboardState>({
    correctKeys: [],
    incorrectKeys: [],
    zoomLevel: 1,
    pressedKey: null,
  });

  // キーイベントのハンドリング
  const handleKeyPress = useCallback<KeyboardHandlers["handleKeyPress"]>(
    (event: KeydownEvent) => {
      // 入力イベントのバリデーション
      if (!event) {
        console.warn("イベントが空です");
        return;
      }
      
      if (!event.code) {
        console.warn("イベントのcodeプロパティが空です:", event);
        return;
      }
      
      const keyCode = event.code;
      
      // デバッグ情報
      console.log("キーボードイベント受信:", {
        key: event.key, 
        code: keyCode, 
        result: event.result
      });
      
      // 現在押されているキーを更新
      setState((prev) => ({
        ...prev,
        pressedKey: { 
          key: event.key, 
          code: keyCode, 
          result: event.result 
        },
      }));

      // 正解判定の場合のアニメーション
      if (event.result === TYPE_JUDGE.CORRECT) {
        console.log("【正解】キーアニメーション:", keyCode);
        
        // 正解キーのアニメーション（複数キーの同時表示対応）
        setState((prev) => {
          // 既に同じキーがある場合は追加しない
          if (prev.correctKeys.includes(keyCode)) {
            return prev;
          }
          return {
            ...prev,
            correctKeys: [...prev.correctKeys, keyCode],
            // 不正解のリストから同じキーを削除
            incorrectKeys: prev.incorrectKeys.filter(k => k !== keyCode)
          };
        });
        
        // アニメーション後に状態をリセット
        setTimeout(() => {
          setState((prev) => {
            console.log("正解キーアニメーションリセット:", keyCode);
            return {
              ...prev,
              correctKeys: prev.correctKeys.filter((code) => code !== keyCode),
            };
          });
        }, 250);
      } 
      // 不正解判定の場合のアニメーション
      else if (event.result === TYPE_JUDGE.INCORRECT) {
        console.log("【不正解】キーアニメーション:", keyCode);
        
        // 不正解キーのアニメーション（複数キーの同時表示対応）
        setState((prev) => {
          // 既に同じキーがある場合は追加しない
          if (prev.incorrectKeys.includes(keyCode)) {
            return prev;
          }
          return {
            ...prev,
            incorrectKeys: [...prev.incorrectKeys, keyCode],
            // 正解のリストから同じキーを削除
            correctKeys: prev.correctKeys.filter(k => k !== keyCode)
          };
        });
        
        // アニメーション後に状態をリセット
        setTimeout(() => {
          setState((prev) => {
            console.log("不正解キーアニメーションリセット:", keyCode);
            return {
              ...prev,
              incorrectKeys: prev.incorrectKeys.filter((code) => code !== keyCode),
            };
          });
        }, 250);
      }
      // 判定なしの場合
      else {
        console.log("判定なし - アニメーションせず:", keyCode);
      }
    },
    []
  );

  // 拡大率の更新
  const updateZoom = useCallback<KeyboardHandlers["updateZoom"]>(() => {
    setState((prev) => ({
      ...prev,
      zoomLevel: window.devicePixelRatio || 1,
    }));
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateZoom);
    updateZoom();

    return () => {
      window.removeEventListener("resize", updateZoom);
    };
  }, [updateZoom]);

  return {
    state,
    handlers: {
      handleKeyPress,
      updateZoom,
    },
  };
};
