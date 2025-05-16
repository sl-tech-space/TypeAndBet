import type { KeydownEvent } from "@/features/games/hooks/keydown.types";

export interface KeyboardState {
  correctKeys: string[];
  incorrectKeys: string[];
  zoomLevel: number;
  pressedKey: KeydownEvent | null;
}

export interface KeyboardHandlers {
  handleKeyPress: (event: KeydownEvent) => void;
  updateZoom: () => void;
}

export type KeyboardLayout = KeyboardKey[][];

export interface KeyboardKey {
  label: string;
  code: string;
  wide?: boolean;
  extraWide?: boolean;
} 