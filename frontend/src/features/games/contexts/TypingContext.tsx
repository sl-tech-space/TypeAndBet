"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

import { INITIAL_VALUE } from "@/constants";
import { isUndefined } from "@/utils";

/**
 * タイピングコンテキストの型
 */
type TypingContextType = {
  correctTypeCount: number;
  setCorrectTypeCount: (value: number | ((prev: number) => number)) => void;
  totalTypeCount: number;
  setTotalTypeCount: (value: number | ((prev: number) => number)) => void;
  accuracy: number;
  // 現在の入力状態
  currentKeyStatus: {
    key: string;
    isCorrect: boolean | null;
  };
  setCurrentKeyStatus: (key: string, isCorrect: boolean | null) => void;
};

/**
 * タイピングコンテキスト
 */
const TypingContext = createContext<TypingContextType | undefined>(undefined);

/**
 * タイピングプロバイダー
 */
export const TypingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // 正タイプ数と総タイプ数のカウント
  const [correctTypeCount, setCorrectTypeCount] =
    useState<number>(INITIAL_VALUE);
  const [totalTypeCount, setTotalTypeCount] = useState<number>(INITIAL_VALUE);

  // 現在入力中のキーとその正誤状態
  const [currentKeyStatus, setCurrentKeyStatusState] = useState<{
    key: string;
    isCorrect: boolean | null;
  }>({
    key: "",
    isCorrect: null,
  });

  // 現在のキーの状態を更新する関数
  const setCurrentKeyStatus = (
    key: string,
    isCorrect: boolean | null
  ): void => {
    setCurrentKeyStatusState({
      key,
      isCorrect,
    });

    // 一定時間後に状態をリセット
    if (isCorrect !== null) {
      setTimeout(() => {
        setCurrentKeyStatusState((prev) => {
          // 同じキーの場合のみリセット
          if (prev.key === key) {
            return { key: "", isCorrect: null };
          }
          return prev;
        });
      }, 300);
    }
  };

  // 正タイプ率の計算 0~100
  const accuracy = useMemo(() => {
    if (totalTypeCount === 0) return 0;
    return Math.round((correctTypeCount / totalTypeCount) * 100);
  }, [correctTypeCount, totalTypeCount]);

  // Contextに渡す値
  const value = {
    correctTypeCount,
    setCorrectTypeCount,
    totalTypeCount,
    setTotalTypeCount,
    accuracy,
    currentKeyStatus,
    setCurrentKeyStatus,
  };

  return (
    <TypingContext.Provider value={value}>{children}</TypingContext.Provider>
  );
};

/**
 * タイピングコンテキストのカスタムフック
 */
export const useTypingContext = (): TypingContextType => {
  const context = useContext(TypingContext);
  if (isUndefined(context)) {
    throw new Error("useTypingContext must be used within a TypingProvider");
  }
  return context as TypingContextType;
};
