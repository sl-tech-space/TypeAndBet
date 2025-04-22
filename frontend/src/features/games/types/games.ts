import { GAME_MODES } from "@/constants";

/**
 * ゲームモードの型
 */
export type GameMode = (typeof GAME_MODES)[keyof typeof GAME_MODES];

/**
 * ゲームモードを選択するためのカスタムフックの戻り値型
 */
export interface UseGameModeReturn {
  gameMode: GameMode | null;
  setGameMode: (mode: GameMode) => void;
  navigateToGameMode: (mode: GameMode) => void;
}


