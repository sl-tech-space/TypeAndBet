"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signup as signupAction } from "@/actions/auth";
import {
  ROUTE,
  SIGNUP_SUCCESS_COUNTDOWN,
  SIGNUP_SUCCESS_COUNTDOWN_INTERVAL,
  SIGNUP_SUCCESS_DECREMENT,
  SIGNUP_SUCCESS_COUNTDOWN_MIN,
} from "@/constants";
import { SignupResult } from "./useSignup.types";

/**
 * サインアップフック
 * @returns サインアップフック
 */
export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === SIGNUP_SUCCESS_COUNTDOWN_MIN) {
      router.push(ROUTE.LOGIN);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - SIGNUP_SUCCESS_DECREMENT);
    }, SIGNUP_SUCCESS_COUNTDOWN_INTERVAL);

    return () => clearTimeout(timer);
  }, [countdown, router]);

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
        setCountdown(SIGNUP_SUCCESS_COUNTDOWN);
        return {
          success: true,
          data: {
            name,
            email,
            passwordLength: password.length,
            countdown: SIGNUP_SUCCESS_COUNTDOWN,
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

  return { signup, isLoading, countdown };
};
