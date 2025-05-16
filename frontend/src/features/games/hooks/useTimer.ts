"use client";

import { useTimerStore } from "@/features/games/stores";

/**
 * タイマーのフック
 * タイマーの時間、実行中かどうか、終了したかどうかを管理する
 * @returns タイマーの時間、実行中かどうか、終了したかどうかを返す
 */
export const useTimer = () => {
  const { time, isRunning, isFinished, startTimer, stopTimer, resetTimer, start } = useTimerStore();

  // 時間を分:秒の形式に変換
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
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
