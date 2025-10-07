"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useEffect, type ReactElement } from "react";

import { Button, Icon, Loading, Text } from "@/components/ui";
import { EMAIL_SENT_MESSAGE, ROUTE } from "@/constants";

import { useEmailSent } from "../../hooks";
import { useSignupSuccessStore } from "../../stores";

import styles from "./EmailSent.module.scss";

/**
 * メール送信完了コンポーネント
 * サインアップ成功後のメール送信完了画面を表示
 * ユーザー情報がない場合は404ページにリダイレクト
 */
export const EmailSent = (): ReactElement => {
  const router = useRouter();
  const { successInfo, clearSuccessInfo } = useSignupSuccessStore();
  const { resendState, cooldownTime, resendMessage, handleResendEmail } =
    useEmailSent();

  // ユーザー情報がない場合は404にリダイレクト
  useEffect((): void => {
    if (!successInfo) {
      router.replace(ROUTE.NOT_FOUND);
    }
  }, [successInfo, router]);

  // メール再送信処理（emailを渡すためのラッパー）
  const handleResend = (): void => {
    if (successInfo?.email) {
      handleResendEmail(successInfo.email);
    }
  };

  // ユーザー情報がない場合は何も表示しない（リダイレクト中）
  if (!successInfo) {
    return (
      <div className={styles["email-sent"]}>
        <Loading />
      </div>
    );
  }

  return (
    <div className={styles["email-sent"]}>
      <div className={styles["email-sent__icon"]}>
        <Icon icon="/assets/svg/mail.svg" alt="メールアイコン" size="xl" />
      </div>
      <Text
        variant="h2"
        size="xlarge"
        color="gold"
        className={styles["email-sent__title"]}
      >
        {EMAIL_SENT_MESSAGE.TITLE}
      </Text>
      <Text
        variant="p"
        size="medium"
        color="secondary"
        className={styles["email-sent__message"]}
      >
        {EMAIL_SENT_MESSAGE.MAIN_MESSAGE}
      </Text>
      <Text
        variant="p"
        size="medium"
        color="secondary"
        className={styles["email-sent__message"]}
      >
        {EMAIL_SENT_MESSAGE.INSTRUCTION}
      </Text>
      <div className={styles["email-sent__note"]}>
        <Text variant="p" size="small" color="gold">
          {EMAIL_SENT_MESSAGE.NOTE}
        </Text>
      </div>
      {/* 再送信セクション */}
      <div className={styles["email-sent__resend"]}>
        <Button
          textColor="secondary"
          backgroundColor="primary"
          isBorder={true}
          borderColor="secondary"
          isRound={true}
          buttonSize="small"
          onClick={handleResend}
          isDisabled={resendState === "sending" || resendState === "cooldown"}
        >
          {resendState === "sending" && "送信中..."}
          {resendState === "cooldown" &&
            `${cooldownTime}${EMAIL_SENT_MESSAGE.RESEND_COOLDOWN}`}
          {(resendState === "idle" || resendState === "error") &&
            EMAIL_SENT_MESSAGE.RESEND_BUTTON}
        </Button>

        {resendMessage && (
          <Text
            variant="p"
            size="small"
            color="secondary"
            className={styles["email-sent__resend-message"]}
          >
            {resendMessage}
          </Text>
        )}
      </div>

      <div className={styles["email-sent__actions"]}>
        <Link href={ROUTE.LOGIN} onClick={clearSuccessInfo}>
          <Button
            textColor="secondary"
            backgroundColor="accent"
            isBorder={true}
            borderColor="gold"
            isRound={true}
            buttonSize="medium"
          >
            {EMAIL_SENT_MESSAGE.LOGIN_BUTTON}
          </Button>
        </Link>

        <Link href={ROUTE.HOME} onClick={clearSuccessInfo}>
          <Button
            textColor="gold"
            backgroundColor="tertiary"
            isBorder={true}
            borderColor="gold"
            isRound={true}
            buttonSize="medium"
          >
            {EMAIL_SENT_MESSAGE.HOME_BUTTON}
          </Button>
        </Link>
      </div>
    </div>
  );
};
