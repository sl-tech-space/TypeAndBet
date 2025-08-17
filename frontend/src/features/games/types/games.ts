import { GAME_MODE } from "@/constants";

/**
 * ゲームモードの型
 */
export type GameMode = (typeof GAME_MODE)[keyof typeof GAME_MODE];

/**
 * ゲームモードを選択するためのカスタムフックの戻り値型
 */
export interface UseGameModeReturn {
  gameMode: GameMode | null;
  setGameMode: (mode: GameMode) => void;
  navigateToGameMode: (mode: GameMode) => void;
}
