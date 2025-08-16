"use client";

import { useCallback, useEffect, useState } from "react";

import { requestPasswordReset } from "@/actions/auth";
import { PASSWORD_RESET_MESSAGE } from "@/constants";

import { useEmailValidation } from "./useValidation";

import type {
  PasswordForgetState,
  UsePasswordForgetReturn,
} from "./usePasswordForget.types";

/**
 * パスワードリセット要求機能のカスタムフック
 * @returns パスワードリセットに関する状態と処理
 */
export const usePasswordForget = (): UsePasswordForgetReturn => {
  // 状態管理
  const [email, setEmail] = useState<string>("");
  const [state, setState] = useState<PasswordForgetState>("idle");
  const [message, setMessage] = useState<string>("");
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // メールアドレスバリデーション
  const { errors: emailErrors, validateEmail } = useEmailValidation();

  // 成功・エラーメッセージの自動リセット
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (state === "success") {
      timer = setTimeout(() => {
        setMessage("");
      }, 10000); // 10秒後にメッセージを消去
    } else if (state === "error") {
      timer = setTimeout(() => {
        setMessage("");
        setState("idle");
      }, 5000); // 5秒後にエラーメッセージを消去
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [state]);

  // メールアドレス変更処理
  const handleEmailChange = useCallback(
    (newEmail: string) => {
      setEmail(newEmail);
      validateEmail(newEmail);
      if (!hasInteracted) {
        setHasInteracted(true);
      }
    },
    [validateEmail, hasInteracted]
  );

  // パスワードリセット要求処理
  const handleSubmit = useCallback(async () => {
    // バリデーション
    const isEmailValid = validateEmail(email);
    if (!isEmailValid) {
      return;
    }

    setState("submitting");
    setMessage("");

    try {
      const result = await requestPasswordReset(email);

      if (result.success) {
        setState("success");
        // サーバーからのメッセージがあれば使用、なければデフォルトメッセージ
        setMessage(result.message || PASSWORD_RESET_MESSAGE.SUCCESS_MESSAGE);
      } else {
        setState("error");
        setMessage(result.error || PASSWORD_RESET_MESSAGE.ERROR_MESSAGE);
      }
    } catch (error) {
      console.error("パスワードリセット要求エラー:", error);
      setState("error");
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage(PASSWORD_RESET_MESSAGE.ERROR_MESSAGE);
      }
    }
  }, [email, validateEmail]);

  return {
    email,
    setEmail,
    state,
    message,
    handleSubmit,
    handleEmailChange,
    isSubmitting: state === "submitting",
    isSuccess: state === "success",
    isError: state === "error",
    emailErrors,
    hasInteracted,
  };
};
