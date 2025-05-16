import type { Sentence } from "./generator.types";

/**
 * タイピングの返り値の型
 */
export type UseTypingReturn = {
  sentences: Sentence[];
  currentSentenceIndex: number;
  input: string;
  isComplete: boolean;
  isStarted: boolean;
  isCountingDown: boolean;
  countdown: number;
  handleKeydown: (event: KeyboardEvent) => void;
  startTyping: () => void;
  resetTyping: () => void;
};

/**
 * 入力状態の型
 */
export type InputState = {
  currentIndex: number; // 現在の入力位置
  currentPattern: number; // 現在のパターン番号
  inputHistory: string[]; // 入力履歴
  confirmedPatterns: number[]; // 確定したパターンのインデックス
};

/**
 * ローマ字進捗の型
 */
export type RomajiProgress = {
  typed: string[];
  current: string;
  remaining: string[];
  inputString: string;
  isValid: boolean;
  nextChars: string[];
  shortRomaji: string[]; // 最短ローマ字表記
  missedChar: string; // ミスした文字
  expectedChar: string; // 期待される文字
};
