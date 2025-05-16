"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { INITIAL_VALUE } from "@/constants";

/**
 * タイピングコンテキストの型
 */
type TypingContextType = {
  correctTypeCount: number;
  setCorrectTypeCount: (value: number | ((prev: number) => number)) => void;
  totalTypeCount: number;
  setTotalTypeCount: (value: number | ((prev: number) => number)) => void;
  accuracy: number;
};

/**
 * タイピングコンテキスト
 */
const TypingContext = createContext<TypingContextType | undefined>(undefined);

/**
 * タイピングプロバイダー
 */
export const TypingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 正タイプ数と総タイプ数のカウント
  const [correctTypeCount, setCorrectTypeCount] = useState<number>(INITIAL_VALUE);
  const [totalTypeCount, setTotalTypeCount] = useState<number>(INITIAL_VALUE);

  // 正タイプ率の計算
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
    accuracy
  };

  return (
    <TypingContext.Provider value={value}>
      {children}
    </TypingContext.Provider>
  );
};

/**
 * タイピングコンテキストのカスタムフック
 */
export const useTypingContext = () => {
  const context = useContext(TypingContext);
  if (context === undefined) {
    throw new Error("useTypingContext must be used within a TypingProvider");
  }
  return context;
}; 