"use client";

import Image from "next/image";
import Link from "next/link";

import { type ReactElement } from "react";

import { Button, Input, Label, Text } from "@/components/ui";
import { NEW_PASSWORD_MESSAGE, ROUTE } from "@/constants";
import { usePasswordReset, usePasswordVisibility } from "@/features/auth/hooks";

import styles from "./PasswordResetForm.module.scss";

import type { PasswordResetFormProps } from "./PasswordResetForm.types";

/**
 * パスワードリセットフォームコンポーネント
 * @param props コンポーネントのプロパティ
 * @returns パスワードリセットフォームコンポーネント
 */
export const PasswordResetForm = ({
  className,
}: PasswordResetFormProps): ReactElement => {
  const {
    password,
    passwordConfirm,
    handlePasswordChange,
    handlePasswordConfirmChange,
    handleSubmit,
    isSubmitting,
    isSuccess,
    isError,
    message,
    passwordErrors,
    passwordConfirmError,
    hasInteracted,
    isTokenValid,
  } = usePasswordReset();

  const { isVisible, toggleVisibility, inputType } = usePasswordVisibility();
  const {
    isVisible: isConfirmVisible,
    toggleVisibility: toggleConfirmVisibility,
    inputType: confirmInputType,
  } = usePasswordVisibility();

  // トークンが無効な場合の表示
  if (!isTokenValid) {
    return (
      <div className={`${styles.passwordResetForm} ${className || ""}`}>
        <div className={styles.passwordResetForm__invalidToken}>
          <Text variant="p" size="medium" color="gold">
            {message}
          </Text>
        </div>
        <div className={styles.passwordResetForm__backLinks}>
          <Link href={ROUTE.PASSWORD_FORGET}>
            <Text variant="p" size="small" color="secondary">
              {NEW_PASSWORD_MESSAGE.BACK_TO_FORGET}
            </Text>
          </Link>
          <Link href={ROUTE.LOGIN}>
            <Text variant="p" size="small" color="secondary">
              {NEW_PASSWORD_MESSAGE.BACK_TO_LOGIN}
            </Text>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      className={`${styles.passwordResetForm} ${className || ""}`}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {/* 説明文 */}
      <div className={styles.passwordResetForm__description}>
        <Text variant="p" size="medium" color="secondary">
          {NEW_PASSWORD_MESSAGE.DESCRIPTION}
        </Text>
      </div>

      {/* エラー表示（全体エラー） */}
      {message && isError && (
        <div className={styles.passwordResetForm__error}>{message}</div>
      )}

      {/* 新しいパスワード入力フィールド */}
      <div className={styles.passwordResetForm__passwordField}>
        <div
          className={styles.passwordResetForm__passwordField__labelContainer}
        >
          <Image
            src="/assets/svg/lock.svg"
            alt="パスワード"
            width={24}
            height={24}
          />
          <Label htmlFor="password" color="gold">
            {NEW_PASSWORD_MESSAGE.PASSWORD_LABEL}
          </Label>
        </div>
        <div
          className={styles.passwordResetForm__passwordField__inputContainer}
        >
          <Input
            type={inputType}
            id="password"
            textColor="secondary"
            backgroundColor="tertiary"
            isBorder={true}
            borderColor="gold"
            placeholder={NEW_PASSWORD_MESSAGE.PASSWORD_PLACEHOLDER}
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            isDisabled={isSubmitting || isSuccess}
          />
          <button
            type="button"
            className={styles.passwordResetForm__visibilityToggle}
            onClick={toggleVisibility}
          >
            <Image
              src={
                isVisible
                  ? "/assets/svg/visibility-off.svg"
                  : "/assets/svg/visibility.svg"
              }
              alt={isVisible ? "パスワードを隠す" : "パスワードを表示"}
              width={24}
              height={24}
            />
          </button>
        </div>
        {/* パスワードエラー表示 */}
        {passwordErrors.length > 0 && hasInteracted && (
          <div className={styles.passwordResetForm__passwordErrors}>
            {passwordErrors.map((error, index) => (
              <div key={index} className={styles.passwordResetForm__error}>
                {error}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* パスワード確認入力フィールド */}
      <div className={styles.passwordResetForm__passwordConfirmField}>
        <div
          className={
            styles.passwordResetForm__passwordConfirmField__labelContainer
          }
        >
          <Image
            src="/assets/svg/lock.svg"
            alt="パスワード確認"
            width={24}
            height={24}
          />
          <Label htmlFor="passwordConfirm" color="gold">
            {NEW_PASSWORD_MESSAGE.PASSWORD_CONFIRM_LABEL}
          </Label>
        </div>
        <div
          className={
            styles.passwordResetForm__passwordConfirmField__inputContainer
          }
        >
          <Input
            type={confirmInputType}
            id="passwordConfirm"
            textColor="secondary"
            backgroundColor="tertiary"
            isBorder={true}
            borderColor="gold"
            placeholder={NEW_PASSWORD_MESSAGE.PASSWORD_CONFIRM_PLACEHOLDER}
            value={passwordConfirm}
            onChange={(e) => handlePasswordConfirmChange(e.target.value)}
            isDisabled={isSubmitting || isSuccess}
          />
          <button
            type="button"
            className={styles.passwordResetForm__visibilityToggle}
            onClick={toggleConfirmVisibility}
          >
            <Image
              src={
                isConfirmVisible
                  ? "/assets/svg/visibility-off.svg"
                  : "/assets/svg/visibility.svg"
              }
              alt={isConfirmVisible ? "パスワードを隠す" : "パスワードを表示"}
              width={24}
              height={24}
            />
          </button>
        </div>
        {/* パスワード確認エラー表示 */}
        {passwordConfirmError && hasInteracted && (
          <div className={styles.passwordResetForm__passwordConfirmErrors}>
            <div className={styles.passwordResetForm__error}>
              {passwordConfirmError}
            </div>
          </div>
        )}
      </div>

      {/* 成功メッセージ */}
      {message && isSuccess && (
        <div className={styles.passwordResetForm__success}>
          <Text variant="p" size="small" color="gold">
            {message}
          </Text>
        </div>
      )}

      {/* 送信ボタン */}
      <div className={styles.passwordResetForm__actions}>
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
            !password ||
            !passwordConfirm ||
            passwordErrors.length > 0 ||
            !!passwordConfirmError
          }
          isLoading={isSubmitting}
          isRound={false}
        >
          {isSubmitting
            ? NEW_PASSWORD_MESSAGE.SUBMITTING_BUTTON
            : NEW_PASSWORD_MESSAGE.SUBMIT_BUTTON}
        </Button>
      </div>

      {/* バックリンク */}
      {!isSuccess && (
        <div className={styles.passwordResetForm__backLinks}>
          <Link href={ROUTE.PASSWORD_FORGET}>
            <Text variant="p" size="small" color="secondary">
              {NEW_PASSWORD_MESSAGE.BACK_TO_FORGET}
            </Text>
          </Link>
          <Link href={ROUTE.LOGIN}>
            <Text variant="p" size="small" color="secondary">
              {NEW_PASSWORD_MESSAGE.BACK_TO_LOGIN}
            </Text>
          </Link>
        </div>
      )}
    </form>
  );
};
