"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { login as loginAction } from "@/actions/auth";
import { ROUTE } from "@/constants";

import { LoginResult } from "./useLogin.types";

/**
 * ログインフック
 * @returns ログインフック
 */
export const useLogin = (): {
  login: (email: string, password: string) => Promise<LoginResult>;
  isLoading: boolean;
} => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = async (
    email: string,
    password: string
  ): Promise<LoginResult> => {
    try {
      setIsLoading(true);
      const result = await loginAction(email, password);

      if (!result) {
        return {
          success: false,
          error: "ログイン処理に失敗しました。もう一度お試しください。",
        };
      }

      if (result.success) {
        // NextAuthのセッションを更新
        await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        router.push(ROUTE.HOME);
        return {
          success: true,
        };
      }

      if (result.error) {
        return {
          success: false,
          error: result.error,
        };
      }

      return {
        success: false,
        error: "予期せぬエラーが発生しました。",
      };
    } catch (error: unknown) {
      console.error("ログイン処理でエラーが発生:", error);
      return {
        success: false,
        error: "ログイン処理中にエラーが発生しました。",
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
  };
};
