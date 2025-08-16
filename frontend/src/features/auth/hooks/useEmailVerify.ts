"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { verifyEmail } from "@/actions/auth";
import { ROUTE } from "@/constants";

/**
 * メール認証の状態を管理するタイプ
 */
export type VerifyState = "verifying" | "success" | "error";

/**
 * useEmailVerifyフックの戻り値の型
 */
export type UseEmailVerifyReturn = {
  verifyState: VerifyState;
  message: string | null;
  error: string | null;
  isLoading: boolean;
  countdown: number | null;
};

/**
 * メール認証機能のカスタムフック
 * URLパラメータからトークンを取得し、自動的に認証処理を実行
 * @returns 認証に関する状態と処理
 */
export const useEmailVerify = (): UseEmailVerifyReturn => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 認証の状態管理
  const [verifyState, setVerifyState] = useState<VerifyState>("verifying");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number | null>(null);

  // カウントダウン開始の共通処理
  const startCountdown = useCallback(
    (redirectTo: string) => {
      setCountdown(3);
      let count = 3;

      const interval = setInterval(() => {
        count -= 1;
        setCountdown(count);

        if (count <= 0) {
          clearInterval(interval);
          router.replace(redirectTo);
        }
      }, 1000);

      return () => clearInterval(interval);
    },
    [router]
  );

  // メール認証処理
  const handleVerifyEmail = useCallback(
    async (token: string) => {
      if (!token) {
        setVerifyState("error");
        setError("認証トークンが見つかりません");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setVerifyState("verifying");

      try {
        const result = await verifyEmail(token);

        if (result.success) {
          setVerifyState("success");
          setMessage(result.message ?? null);
          setError(null);

          // 3秒カウントダウン後にログインページにリダイレクト
          startCountdown(ROUTE.LOGIN);
        } else {
          setVerifyState("error");
          setError(result.error);
          setMessage(null);

          // 3秒カウントダウン後に500エラーページにリダイレクト
          startCountdown(ROUTE.SERVER_ERROR);
        }
      } catch (error) {
        console.error("メール認証エラー:", error);
        setVerifyState("error");
        setError("認証処理中にエラーが発生しました");
        setMessage(null);

        // 3秒カウントダウン後に500エラーページにリダイレクト
        startCountdown(ROUTE.SERVER_ERROR);
      } finally {
        setIsLoading(false);
      }
    },
    [startCountdown]
  );

  // URLパラメータからトークンを取得して認証処理を実行
  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setVerifyState("error");
      setError("認証トークンが見つかりません");
      setIsLoading(false);

      // 3秒カウントダウン後に500エラーページにリダイレクト
      startCountdown(ROUTE.SERVER_ERROR);
      return;
    }

    handleVerifyEmail(token);
  }, [searchParams, handleVerifyEmail, startCountdown]);

  return {
    verifyState,
    message,
    error,
    isLoading,
    countdown,
  };
};
