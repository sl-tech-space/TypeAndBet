"use client";

import { Button, Input, Label } from "@/components/ui";
import { usePasswordVisibility } from "@/features/auth";
import { FORM_LABEL, FORM_PLACEHOLDER } from "@/constants";
import Image from "next/image";
import styles from "./LoginForm.module.scss";
import { FormEvent, useState } from "react";
import { useLogin } from "@/features/auth/hooks/useLogin";
import {
  usePasswordValidation,
  useEmailValidation,
} from "@/features/auth/hooks/useValidation";

/**
 * クライアントコンポーネント
 * ログインフォーム
 * @returns ログインフォーム
 */
export const LoginForm = () => {
  const { isVisible, toggleVisibility, inputType } = usePasswordVisibility();
  const { login, isLoading } = useLogin();
  const { errors: passwordErrors, validatePassword } = usePasswordValidation();
  const { errors: emailErrors, validateEmail } = useEmailValidation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  /**
   * フォームの有効性を確認
   */
  const checkFormValidity = (newEmail: string, newPassword: string) => {
    const isEmailValid = validateEmail(newEmail);
    const isPasswordValid = validatePassword(newPassword);
    setIsFormValid(isEmailValid && isPasswordValid);
  };

  /**
   * メールアドレス入力時のバリデーション
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
    checkFormValidity(newEmail, password);
  };

  /**
   * パスワード入力時のバリデーション
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
    checkFormValidity(email, newPassword);
  };

  /**
   * ログインフォームの送信
   * @param e フォームのイベント
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!isFormValid) {
      return;
    }

    const result = await login(email, password);

    if (!result?.success) {
      if (result?.error) {
        setError(Object.values(result.error).join(""));
      } else if (result?.error) {
        setError(result.error);
      }
    }
  };

  return (
    <form className={styles["login-form"]} onSubmit={handleSubmit}>
      {error && <div className={styles["login-form__error"]}>{error}</div>}
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
        {emailErrors.length > 0 && (
          <div className={styles["login-form__email-errors"]}>
            {emailErrors.map((error, index) => (
              <div key={index} className={styles["login-form__error"]}>
                {error}
              </div>
            ))}
          </div>
        )}
      </div>
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
        {passwordErrors.length > 0 && (
          <div className={styles["login-form__password-errors"]}>
            {passwordErrors.map((error, index) => (
              <div key={index} className={styles["login-form__error"]}>
                {error}
              </div>
            ))}
          </div>
        )}
      </div>
      <Button
        type="submit"
        textColor="secondary"
        backgroundColor="accent"
        isBorder={true}
        borderColor="tertiary"
        buttonSize="medium"
        isDisabled={isLoading || !isFormValid}
        isLoading={isLoading}
        isRound={false}
      >
        ログイン
      </Button>
    </form>
  );
};

export default LoginForm;
