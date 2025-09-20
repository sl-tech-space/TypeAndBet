"use client";

import { SessionProvider } from "next-auth/react";
import { type ReactElement } from "react";

import { ModeSelector } from "./ModeSelector";

/**
 * モードセレクターのラッパー
 * @returns モードセレクターのラッパー
 */
export const ModeSelectorWrapper = (): ReactElement => {
  return (
    <SessionProvider>
      <ModeSelector />
    </SessionProvider>
  );
};
