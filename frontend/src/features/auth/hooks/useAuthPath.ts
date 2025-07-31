"use client";

import { usePathname } from "next/navigation";

import { ROUTE } from "@/constants";

/**
 * 認証画面のパスを取得する
 * @returns
 */
export const useAuthPath = (): {
  isLoginScreen: boolean;
  isSignupScreen: boolean;
} => {
  const pathname = usePathname();

  const isLoginScreen = pathname === ROUTE.LOGIN;
  const isSignupScreen = pathname === ROUTE.SIGNUP;

  return {
    isLoginScreen,
    isSignupScreen,
  };
};

export default useAuthPath;
