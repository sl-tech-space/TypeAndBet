"use client";

import { useState } from "react";

type SignupResult = {
  success: boolean;
  error?: string | Record<string, string>;
};

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<SignupResult> => {
    setIsLoading(true);
    try {
      // TODO: 実際のサインアップ処理を実装
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "サインアップに失敗しました",
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading };
};
