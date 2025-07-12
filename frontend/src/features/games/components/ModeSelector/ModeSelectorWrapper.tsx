import { ModeSelector } from "./ModeSelector";
import { SessionProvider } from "next-auth/react";

/**
 * モードセレクターのラッパー
 * @returns モードセレクターのラッパー
 */
export const ModeSelectorWrapper = () => {
  return (
    <SessionProvider>
      <ModeSelector />
    </SessionProvider>
  );
};

export default ModeSelectorWrapper;
