"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { resetPassword } from "@/actions/auth";
import { NEW_PASSWORD_MESSAGE, ROUTE } from "@/constants";
import { usePasswordValidation } from "./useValidation";

import type {
  PasswordResetState,
  UsePasswordResetReturn,
} from "./usePasswordReset.types";

/**
 * パスワードリセット機能のカスタムフック
 * @returns パスワードリセットに関する状態と処理
 */
export const usePasswordReset = (): UsePasswordResetReturn => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  // 状態管理
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [state, setState] = useState<PasswordResetState>("idle");
  const [message, setMessage] = useState<string>("");
  const [passwordConfirmError, setPasswordConfirmError] = useState<string>("");
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(true);

  // パスワードバリデーション
  const { errors: passwordErrors, validatePassword } = usePasswordValidation();

  // トークンの存在確認
  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      setMessage(NEW_PASSWORD_MESSAGE.INVALID_TOKEN_MESSAGE);
      setState("error");
    }
  }, [token]);

  // 成功時のリダイレクト
  useEffect(() => {
    if (state === "success") {
      const timer = setTimeout(() => {
        router.push(ROUTE.LOGIN);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state, router]);

  // エラーメッセージの自動リセット
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (state === "error" && isTokenValid) {
      timer = setTimeout(() => {
        setMessage("");
        setState("idle");
      }, 5000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [state, isTokenValid]);

  // パスワード確認のバリデーション
  const validatePasswordConfirm = useCallback(
    (confirmPassword: string): string => {
      if (!confirmPassword) {
        return "パスワード確認を入力してください";
      }
      if (password && confirmPassword !== password) {
        return "パスワードが一致しません";
      }
      return "";
    },
    [password]
  );

  // パスワード変更処理
  const handlePasswordChange = useCallback(
    (newPassword: string) => {
      setPassword(newPassword);
      validatePassword(newPassword);

      // パスワード確認も再検証
      if (passwordConfirm) {
        const confirmError = validatePasswordConfirm(passwordConfirm);
        setPasswordConfirmError(confirmError);
      }

      if (!hasInteracted) {
        setHasInteracted(true);
      }
    },
    [validatePassword, passwordConfirm, validatePasswordConfirm, hasInteracted]
  );

  // パスワード確認変更処理
  const handlePasswordConfirmChange = useCallback(
    (newPasswordConfirm: string) => {
      setPasswordConfirm(newPasswordConfirm);
      const error = validatePasswordConfirm(newPasswordConfirm);
      setPasswordConfirmError(error);

      if (!hasInteracted) {
        setHasInteracted(true);
      }
    },
    [validatePasswordConfirm, hasInteracted]
  );

  // パスワードリセット処理
  const handleSubmit = useCallback(async () => {
    if (!token || !isTokenValid) {
      return;
    }

    // バリデーション
    const isPasswordValid = validatePassword(password);
    const confirmError = validatePasswordConfirm(passwordConfirm);

    if (!isPasswordValid || confirmError) {
      setPasswordConfirmError(confirmError);
      return;
    }

    setState("submitting");
    setMessage("");

    try {
      const result = await resetPassword(token, password, passwordConfirm);

      if (result.success) {
        setState("success");
        setMessage(result.message || NEW_PASSWORD_MESSAGE.SUCCESS_MESSAGE);
      } else {
        setState("error");
        // トークンエラーの特別処理
        if (
          result.error?.includes("無効") ||
          result.error?.includes("invalid")
        ) {
          setIsTokenValid(false);
          setMessage(NEW_PASSWORD_MESSAGE.INVALID_TOKEN_MESSAGE);
        } else if (
          result.error?.includes("期限") ||
          result.error?.includes("expired")
        ) {
          setIsTokenValid(false);
          setMessage(NEW_PASSWORD_MESSAGE.EXPIRED_TOKEN_MESSAGE);
        } else {
          setMessage(result.error || NEW_PASSWORD_MESSAGE.ERROR_MESSAGE);
        }
      }
    } catch (error) {
      console.error("パスワードリセットエラー:", error);
      setState("error");
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage(NEW_PASSWORD_MESSAGE.ERROR_MESSAGE);
      }
    }
  }, [
    token,
    isTokenValid,
    password,
    passwordConfirm,
    validatePassword,
    validatePasswordConfirm,
  ]);

  return {
    password,
    passwordConfirm,
    token,
    state,
    message,
    handlePasswordChange,
    handlePasswordConfirmChange,
    handleSubmit,
    isSubmitting: state === "submitting",
    isSuccess: state === "success",
    isError: state === "error",
    passwordErrors,
    passwordConfirmError,
    hasInteracted,
    isTokenValid,
  };
};
