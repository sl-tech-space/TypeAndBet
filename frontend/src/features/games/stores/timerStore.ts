import { create } from "zustand";

/**
 * タイマーの状態管理の型
 */
type TimerStore = {
  time: number;
  isRunning: boolean;
  isFinished: boolean;
  startTimer: (initialTime: number) => void;
  stopTimer: () => void;
  resetTimer: () => void;
  start: () => void;
};

/**
 * タイマーの状態管理
 * タイマーの開始、停止、リセット、タイマーの時間を管理する
 */
export const useTimerStore = create<TimerStore>((set, get) => ({
  time: 0,
  isRunning: false,
  isFinished: false,
  startTimer: (initialTime: number) =>
    set({ time: initialTime, isRunning: false, isFinished: false }),
  stopTimer: () => set({ time: 0, isRunning: false, isFinished: false }),
  resetTimer: () => set({ time: 0, isRunning: false, isFinished: false }),
  start: () => {
    const { time, isRunning } = get();
    if (time > 0 && !isRunning) {
      set({ isRunning: true, isFinished: false });
      const timer = setInterval(() => {
        const { time, isRunning } = get();
        if (time <= 0 || !isRunning) {
          clearInterval(timer);
          set({ isRunning: false, isFinished: true });
          return;
        }
        set({ time: time - 1 });
      }, 1000);
    }
  },
}));
