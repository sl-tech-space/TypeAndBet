import { create } from "zustand";

import type { GameResult } from "@/features/result/types";

/**
 * ゲーム結果ストア
 */
type ResultStore = {
  result: GameResult | null;
  setResult: (result: GameResult) => void;
  clearResult: () => void;
};

/**
 * ゲーム結果ストア
 */
export const useResultStore = create<ResultStore>((set) => ({
  result: null,
  setResult: (result) => set({ result }),
  clearResult: () => set({ result: null }),
}));
