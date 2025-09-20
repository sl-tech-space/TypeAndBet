"use client";

import { useCallback, useEffect, useState } from "react";

import { resendVerificationEmail } from "@/actions/auth";
import { EMAIL_SENT_MESSAGE } from "@/constants";

import {
  type ResendState,
  type UseEmailSentReturn,
} from "./useEmailSent.types";

/**
 * メール再送信機能のカスタムフック
 * @returns 再送信に関する状態と処理
 */
export const useEmailSent = (): UseEmailSentReturn => {
  // 再送信機能の状態管理
  const [resendState, setResendState] = useState<ResendState>("idle");
  const [cooldownTime, setCooldownTime] = useState<number>(0);
  const [resendMessage, setResendMessage] = useState<string>("");

  // クールダウンタイマー
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (resendState === "cooldown" && cooldownTime > 0) {
      interval = setInterval(() => {
        setCooldownTime((prev) => {
          if (prev <= 1) {
            setResendState("idle");
            setResendMessage("");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [resendState, cooldownTime]);

  // エラーメッセージの自動リセット
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (resendState === "error") {
      timer = setTimeout(() => {
        setResendMessage("");
      }, 5000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [resendState]);

  // メール再送信処理
  const handleResendEmail = useCallback(
    async (email: string) => {
      if (!email || resendState === "sending" || resendState === "cooldown") {
        return;
      }

      setResendState("sending");
      setResendMessage("");

      try {
        const result = await resendVerificationEmail(email);

        if (result.success) {
          setResendState("cooldown");
          setCooldownTime(30);
          setResendMessage(EMAIL_SENT_MESSAGE.RESEND_SUCCESS);
        } else {
          setResendState("error");
          setResendMessage(result.error || EMAIL_SENT_MESSAGE.RESEND_ERROR);
        }
      } catch (error) {
        console.error("メール再送信エラー:", error);
        setResendState("error");
        setResendMessage(EMAIL_SENT_MESSAGE.RESEND_ERROR);
      }
    },
    [resendState]
  );

  return {
    resendState,
    cooldownTime,
    resendMessage,
    handleResendEmail,
  };
};
