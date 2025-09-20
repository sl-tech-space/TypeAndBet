"use client";

import { useState } from "react";

import { signup as signupAction } from "@/actions/auth";

import { SignupResult } from "./useSignup.types";

/**
 * サインアップフック
 * @returns サインアップフック
 */
export const useSignup = (): {
  signup: (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ) => Promise<SignupResult>;
  isLoading: boolean;
} => {
  const [isLoading, setIsLoading] = useState(false);

  const signup = async (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ): Promise<SignupResult> => {
    setIsLoading(true);
    try {
      const result = await signupAction(
        name,
        email,
        password,
        passwordConfirmation
      );

      if (!result) {
        return {
          success: false,
          error: "サインアップに失敗しました",
        };
      }

      if (result.success) {
        return {
          success: true,
          data: {
            name,
            email,
            passwordLength: password.length,
          },
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
        error: "予期せぬエラーが発生しました",
      };
    } catch (error: unknown) {
      console.error("サインアップエラー:", error);
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
