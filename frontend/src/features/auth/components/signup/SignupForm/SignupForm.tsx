"use client";

import { Button, Input, Label } from "@/components/ui";
import { usePasswordVisibility } from "@/features/auth";
import { FORM_LABEL, FORM_PLACEHOLDER } from "@/constants";
import Image from "next/image";
import styles from "./SignupForm.module.scss";
import { FormEvent, useState } from "react";
import { useSignup } from "@/features/auth/hooks";
import {
  usePasswordValidation,
  useEmailValidation,
  useNameValidation,
} from "@/features/auth/hooks/useValidation";

/**
 * クライアントコンポーネント
 * 新規登録フォーム
 * @returns 新規登録フォーム
 */
export const SignupForm = () => {
  const { isVisible, toggleVisibility, inputType } = usePasswordVisibility();
  const { signup, isLoading } = useSignup();
  const { errors: passwordErrors, validatePassword } = usePasswordValidation();
  const { errors: emailErrors, validateEmail } = useEmailValidation();
  const { errors: nameErrors, validateName } = useNameValidation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [passwordConfirmError, setPasswordConfirmError] = useState<
    string | null
  >(null);

  /**
   * 名前入力時のバリデーション
   */
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    validateName(newName);
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  /**
   * メールアドレス入力時のバリデーション
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
    validatePasswordConfirm(newPassword, passwordConfirm);
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  /**
   * パスワード確認入力時のバリデーション
   */
  const handlePasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPasswordConfirm = e.target.value;
    setPasswordConfirm(newPasswordConfirm);
    validatePasswordConfirm(password, newPasswordConfirm);
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  /**
   * パスワード確認のバリデーション
   */
  const validatePasswordConfirm = (
    password: string,
    confirmPassword: string
  ) => {
    if (password !== confirmPassword) {
      setPasswordConfirmError("パスワードが一致しません");
      return false;
    }
    setPasswordConfirmError(null);
    return true;
  };

  /**
   * 新規登録フォームの送信
   * @param e フォームのイベント
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // 各フィールドのバリデーション
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isPasswordConfirmValid = validatePasswordConfirm(
      password,
      passwordConfirm
    );

    if (
      !isNameValid ||
      !isEmailValid ||
      !isPasswordValid ||
      !isPasswordConfirmValid
    ) {
      return;
    }

    const result = await signup(name, email, password);

    if (!result?.success) {
      if (result?.error) {
        setError(Object.values(result.error).join(""));
      } else if (result?.error) {
        // setError(result.error);
      }
    }
  };

  // ボタンの無効化条件
  const isButtonDisabled =
    isLoading ||
    !hasInteracted ||
    !name ||
    !email ||
    !password ||
    !passwordConfirm ||
    passwordErrors.length > 0 ||
    emailErrors.length > 0 ||
    nameErrors.length > 0 ||
    passwordConfirmError !== null;

  return (
    <form className={styles["signup-form"]} onSubmit={handleSubmit}>
      {error && <div className={styles["signup-form__error"]}>{error}</div>}
      <div className={styles["signup-form__name-field"]}>
        <div className={styles["signup-form__name-field__label-container"]}>
          <Image
            src="/assets/svg/id-card.svg"
            alt="ユーザ名"
            width={24}
            height={24}
          />
          <Label htmlFor="name" color="gold">
            {FORM_LABEL.NAME}
          </Label>
        </div>
        <Input
          type="text"
          id="name"
          textColor="secondary"
          backgroundColor="tertiary"
          isBorder={true}
          borderColor="gold"
          placeholder={FORM_PLACEHOLDER.NAME}
          value={name}
          onChange={handleNameChange}
        />
        {nameErrors.length > 0 && hasInteracted && (
          <div className={styles["signup-form__name-errors"]}>
            {nameErrors.map((error, index) => (
              <div key={index} className={styles["signup-form__error"]}>
                {error}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styles["signup-form__email-field"]}>
        <div className={styles["signup-form__email-field__label-container"]}>
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
        {emailErrors.length > 0 && hasInteracted && (
          <div className={styles["signup-form__email-errors"]}>
            {emailErrors.map((error, index) => (
              <div key={index} className={styles["signup-form__error"]}>
                {error}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styles["signup-form__password-field"]}>
        <div className={styles["signup-form__password-field__label-container"]}>
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
        <div className={styles["signup-form__password-field__input-container"]}>
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
            className={styles["signup-form__visibility-toggle"]}
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
        {passwordErrors.length > 0 && hasInteracted && (
          <div className={styles["signup-form__password-errors"]}>
            {passwordErrors.map((error, index) => (
              <div key={index} className={styles["signup-form__error"]}>
                {error}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styles["signup-form__password-confirm-field"]}>
        <div
          className={
            styles["signup-form__password-confirm-field__label-container"]
          }
        >
          <Image
            src="/assets/svg/lock.svg"
            alt="パスワード確認"
            width={24}
            height={24}
          />
          <Label htmlFor="passwordConfirm" color="gold">
            {FORM_LABEL.PASSWORD_CONFIRM}
          </Label>
        </div>
        <div
          className={
            styles["signup-form__password-confirm-field__input-container"]
          }
        >
          <Input
            type={inputType}
            id="passwordConfirm"
            textColor="secondary"
            backgroundColor="tertiary"
            isBorder={true}
            borderColor="gold"
            placeholder={FORM_PLACEHOLDER.PASSWORD_CONFIRM}
            value={passwordConfirm}
            onChange={handlePasswordConfirmChange}
          />
          <button
            type="button"
            className={styles["signup-form__visibility-toggle"]}
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
        {passwordConfirmError && hasInteracted && (
          <div className={styles["signup-form__password-confirm-error"]}>
            {passwordConfirmError}
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
        isDisabled={isButtonDisabled}
        isLoading={isLoading}
        isRound={false}
      >
        新規登録
      </Button>
    </form>
  );
};

export default SignupForm;
