"use client";

import { ROUTE } from "@/constants";

import { useBaseRouter } from "./useBaseRouter";

/**
 * アプリのカスタムナビゲーター
 * @returns アプリのカスタムナビゲーター
 */
export function useNavigator() {
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
    toError: {
      to404: () => push(ROUTE.NOT_FOUND),
      to500: () => push(ROUTE.SERVER_ERROR),
    },
  };
}
