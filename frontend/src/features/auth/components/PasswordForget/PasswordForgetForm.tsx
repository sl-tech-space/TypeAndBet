"use client";

import Image from "next/image";
import Link from "next/link";

import { type ReactElement } from "react";

import { Button, Input, Label, Text } from "@/components/ui";
import { PASSWORD_RESET_MESSAGE, ROUTE } from "@/constants";
import { usePasswordForget } from "@/features/auth/hooks";

import styles from "./PasswordForgetForm.module.scss";

import type { PasswordForgetFormProps } from "./PasswordForgetForm.types";

/**
 * パスワードを忘れたフォームコンポーネント
 * @param props コンポーネントのプロパティ
 * @returns パスワードを忘れたフォームコンポーネント
 */
export const PasswordForgetForm = ({
  className,
}: PasswordForgetFormProps): ReactElement => {
  const {
    email,
    handleEmailChange,
    handleSubmit,
    isSubmitting,
    isSuccess,
    message,
    emailErrors,
    hasInteracted,
  } = usePasswordForget();

  return (
    <form
      className={`${styles.passwordForgetForm} ${className || ""}`}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {/* 説明文 */}
      <div className={styles.passwordForgetForm__description}>
        <Text variant="p" size="medium" color="secondary">
          {PASSWORD_RESET_MESSAGE.DESCRIPTION}
        </Text>
      </div>

      {/* エラー表示（全体エラー） */}
      {message && !isSuccess && (
        <div className={styles.passwordForgetForm__error}>{message}</div>
      )}

      {/* メールアドレス入力フィールド */}
      <div className={styles.passwordForgetForm__emailField}>
        <div className={styles.passwordForgetForm__emailField__labelContainer}>
          <Image
            src="/assets/svg/mail.svg"
            alt="メールアドレス"
            width={24}
            height={24}
          />
          <Label htmlFor="email" color="gold">
            {PASSWORD_RESET_MESSAGE.EMAIL_LABEL}
          </Label>
        </div>
        <Input
          type="email"
          id="email"
          textColor="secondary"
          backgroundColor="tertiary"
          isBorder={true}
          borderColor="gold"
          placeholder={PASSWORD_RESET_MESSAGE.EMAIL_PLACEHOLDER}
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          isDisabled={isSubmitting || isSuccess}
        />
        {/* メールアドレスエラー表示 */}
        {emailErrors.length > 0 && hasInteracted && (
          <div className={styles.passwordForgetForm__emailErrors}>
            {emailErrors.map((error, index) => (
              <div key={index} className={styles.passwordForgetForm__error}>
                {error}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 成功メッセージ */}
      {message && isSuccess && (
        <div className={styles.passwordForgetForm__success}>
          <Text variant="p" size="small" color="gold">
            {message}
          </Text>
        </div>
      )}

      {/* 送信ボタン */}
      <Button
        type="submit"
        textColor="secondary"
        backgroundColor="accent"
        isBorder={true}
        borderColor="tertiary"
        buttonSize="medium"
        isDisabled={
          isSubmitting ||
          isSuccess ||
          !hasInteracted ||
          !email ||
          emailErrors.length > 0
        }
        isLoading={isSubmitting}
        isRound={false}
      >
        {isSubmitting
          ? PASSWORD_RESET_MESSAGE.SUBMITTING_BUTTON
          : PASSWORD_RESET_MESSAGE.SUBMIT_BUTTON}
      </Button>

      {/* 成功時の注意書き */}
      {isSuccess && (
        <div className={styles.passwordForgetForm__note}>
          <Text variant="p" size="small" color="gold">
            {PASSWORD_RESET_MESSAGE.NOTE}
          </Text>
        </div>
      )}

      {/* ログインページへ戻るリンク */}
      <div className={styles.passwordForgetForm__backLink}>
        <Link href={ROUTE.LOGIN}>
          <Text variant="p" size="small" color="secondary">
            {PASSWORD_RESET_MESSAGE.BACK_TO_LOGIN}
          </Text>
        </Link>
      </div>
    </form>
  );
};
