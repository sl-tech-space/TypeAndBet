"use client";

import Image from "next/image";

import {
  type FormEvent,
  type ChangeEvent,
  type ReactElement,
  useState,
} from "react";

import { Button, Input, Label } from "@/components/ui";
import {
  FORM_LABEL,
  FORM_PLACEHOLDER,
  ERROR_MESSAGE,
  ROUTE_NAME,
} from "@/constants";
import { usePasswordVisibility } from "@/features/auth";
import {
  useLogin,
  usePasswordValidation,
  useEmailValidation,
} from "@/features/auth";
import type { LoginResult } from "@/features/auth";

import styles from "./LoginForm.module.scss";

/**
 * クライアントコンポーネント
 * ログインフォーム
 * @returns ログインフォーム
 */
export const LoginForm = (): ReactElement => {
  const { isVisible, toggleVisibility, inputType } = usePasswordVisibility();
  const { login, isLoading } = useLogin();
  const { errors: passwordErrors, validatePassword } = usePasswordValidation();
  const { errors: emailErrors, validateEmail } = useEmailValidation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  /**
   * メールアドレス入力時のバリデーション
   */
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  /**
   * パスワード入力時のバリデーション
   */
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  /**
   * ログインフォームの送信
   * @param e フォームのイベント
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);

    // メールアドレスとパスワードのバリデーション
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    const result: LoginResult = await login(email, password);

    if (!result.success) {
      if (result.error) {
        setError(Object.values(result.error).join(""));
      } else if (result.error) {
        setError(result.error);
      } else {
        setError(ERROR_MESSAGE.UNEXPECTED);
      }
    }
  };

  // ボタンの無効化条件
  const isButtonDisabled =
    isLoading ||
    !hasInteracted ||
    !email ||
    !password ||
    passwordErrors.length > 0 ||
    emailErrors.length > 0;

  return (
    <form className={styles["login-form"]} onSubmit={handleSubmit}>
      {/* エラー表示 */}
      {error && <div className={styles["login-form__error"]}>{error}</div>}
      {/* メールアドレス入力フィールド */}
      <div className={styles["login-form__email-field"]}>
        <div className={styles["login-form__email-field__label-container"]}>
          <Image
            src="/assets/svg/mail.svg"
            alt="メールアドレス"
            width={24}
            height={24}
          />
          <Label htmlFor="email" color="gold">
            {FORM_LABEL.EMAIL}
          </Label>
        </div>
        <Input
          type="email"
          id="email"
          textColor="secondary"
          backgroundColor="tertiary"
          isBorder={true}
          borderColor="gold"
          placeholder={FORM_PLACEHOLDER.EMAIL}
          value={email}
          onChange={handleEmailChange}
        />
        {/* メールアドレスエラー表示 */}
        {emailErrors.length > 0 && hasInteracted && (
          <div className={styles["login-form__email-errors"]}>
            {emailErrors.map((error, index) => (
              <div key={index} className={styles["login-form__error"]}>
                {error}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* パスワード入力フィールド */}
      <div className={styles["login-form__password-field"]}>
        <div className={styles["login-form__password-field__label-container"]}>
          <Image
            src="/assets/svg/lock.svg"
            alt="パスワード"
            width={24}
            height={24}
          />
          <Label htmlFor="password" color="gold">
            {FORM_LABEL.PASSWORD}
          </Label>
        </div>
        <div className={styles["login-form__password-field__input-container"]}>
          <Input
            type={inputType}
            id="password"
            textColor="secondary"
            backgroundColor="tertiary"
            isBorder={true}
            borderColor="gold"
            placeholder={FORM_PLACEHOLDER.PASSWORD}
            value={password}
            onChange={handlePasswordChange}
          />
          <button
            type="button"
            className={styles["login-form__visibility-toggle"]}
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
          <div className={styles["login-form__password-errors"]}>
            {passwordErrors.map((error, index) => (
              <div key={index} className={styles["login-form__error"]}>
                {error}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* ログインボタン */}
      <Button
        type="submit"
        textColor="secondary"
        backgroundColor="accent"
        isBorder={true}
        borderColor="tertiary"
        buttonSize="medium"
        isDisabled={isButtonDisabled}
        isLoading={isLoading}
        isRound={false}
      >
        {ROUTE_NAME.LOGIN}
      </Button>
    </form>
  );
};
