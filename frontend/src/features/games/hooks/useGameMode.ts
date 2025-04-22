"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ROUTE } from "@/constants";
import { GAME_MODES } from "@/constants";
import type { GameMode, UseGameModeReturn } from "@/features/games";

/**
 * ゲームモードを選択するカスタムフック
 * @returns ゲームモードを選択するカスタムフック
 */
export const useGameMode = (): UseGameModeReturn => {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const router = useRouter();

  /**
   * ゲームモードを選択するコールバック関数
   * ゲームモードを選択すると、そのモードに応じたルーティングに遷移する
   * @param mode ゲームモード
   */
  const navigateToGameMode = useCallback(
    (mode: GameMode) => {
      setGameMode(mode);

      if (mode === GAME_MODES.SIMULATE) {
        router.push(ROUTE.SIMULATE);
      } else if (mode === GAME_MODES.PLAY) {
        router.push(ROUTE.PLAY);
      }
    },
    [router]
  );

  return { gameMode, setGameMode, navigateToGameMode };
};
