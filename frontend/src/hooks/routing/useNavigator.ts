"use client";

import { ROUTE } from "@/constants";

import { useBaseRouter } from "./useBaseRouter";

/**
 * アプリのカスタムナビゲーター
 * @returns アプリのカスタムナビゲーター
 */
export const useNavigator = (): {
  toHome: () => void;
  toLogin: () => void;
  toSignup: () => void;
  toPlay: () => void;
  toPlayById: (gameId: string) => void;
  toSimulate: () => void;
  toSimulateById: (sessionId: string) => void;
  toResult: () => void;
  toError: {
    to404: () => void;
    to500: () => void;
  };
} => {
  const { push } = useBaseRouter();

  return {
    toHome: () => push(ROUTE.HOME),
    toLogin: () => push(ROUTE.LOGIN),
    toSignup: () => push(ROUTE.SIGNUP),

    toPlay: () => push(ROUTE.PLAY),
    toPlayById: (sessionId: string) => push(`${ROUTE.PLAY}/${sessionId}`),

    toSimulate: () => push(ROUTE.SIMULATE),
    toSimulateById: (sessionId: string) =>
      push(`${ROUTE.SIMULATE}/${sessionId}`),

    toResult: () => push(ROUTE.RESULT),

    toError: {
      to404: () => push(ROUTE.NOT_FOUND),
      to500: () => push(ROUTE.SERVER_ERROR),
    },
  };
};
