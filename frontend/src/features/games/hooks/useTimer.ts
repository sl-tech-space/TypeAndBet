"use client";

import { useTimerStore } from "@/features/games/stores";

/**
 * タイマーのフック
 * タイマーの時間、実行中かどうか、終了したかどうかを管理する
 * @returns タイマーの時間、実行中かどうか、終了したかどうかを返す
 */
export const useTimer = (): {
  time: number;
  isRunning: boolean;
  isFinished: boolean;
  startTimer: (initialTime: number) => void;
  stopTimer: () => void;
  resetTimer: () => void;
  start: () => void;
  formatTime: (seconds: number) => string;
} => {
  const {
    time,
    isRunning,
    isFinished,
    startTimer,
    stopTimer,
    resetTimer,
    start,
  } = useTimerStore();

  // 時間を分:秒の形式に変換
  const formatTime = (seconds: number): string => {
    const isNegative = seconds < 0;
    const absSeconds = Math.abs(seconds);
    const minutes = Math.floor(absSeconds / 60);
    const remainingSeconds = absSeconds % 60;
    const timeString = `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    return isNegative ? `-${timeString}` : timeString;
  };

  return {
    time,
    isRunning,
    isFinished,
    startTimer,
    stopTimer,
    resetTimer,
    start,
    formatTime,
  };
};
