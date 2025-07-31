"use client";

import { useState } from "react";

import {
  PASSWORD_VALIDATION,
  EMAIL_VALIDATION,
  NAME_VALIDATION,
} from "@/constants";

/**
 * パスワードのバリデーションフック
 * @returns パスワードのバリデーションフック
 */
export const usePasswordValidation = (): {
  errors: string[];
  validatePassword: (password: string) => boolean;
} => {
  const [errors, setErrors] = useState<string[]>([]);

  const validatePassword = (password: string): boolean => {
    const newErrors: string[] = [];

    // 必須チェック
    if (!password) {
      newErrors.push(PASSWORD_VALIDATION.ERROR_MESSAGES.REQUIRED);
      setErrors(newErrors);
      return false;
    }

    // 長さのチェック
    if (password.length < PASSWORD_VALIDATION.MIN_LENGTH) {
      newErrors.push(PASSWORD_VALIDATION.ERROR_MESSAGES.MIN_LENGTH);
    }
    if (password.length > PASSWORD_VALIDATION.MAX_LENGTH) {
      newErrors.push(PASSWORD_VALIDATION.ERROR_MESSAGES.MAX_LENGTH);
    }

    // 大文字のチェック
    const uppercaseMatches = password.match(
      PASSWORD_VALIDATION.PATTERN.UPPERCASE
    );
    if (
      !uppercaseMatches ||
      uppercaseMatches.length < PASSWORD_VALIDATION.MIN_UPPERCASE
    ) {
      newErrors.push(PASSWORD_VALIDATION.ERROR_MESSAGES.MIN_UPPERCASE);
    }

    // 数字のチェック
    const numberMatches = password.match(PASSWORD_VALIDATION.PATTERN.NUMBER);
    if (
      !numberMatches ||
      numberMatches.length < PASSWORD_VALIDATION.MIN_NUMBER
    ) {
      newErrors.push(PASSWORD_VALIDATION.ERROR_MESSAGES.MIN_NUMBER);
    }

    // 小文字のチェック
    const lowercaseMatches = password.match(
      PASSWORD_VALIDATION.PATTERN.LOWERCASE
    );
    if (
      !lowercaseMatches ||
      lowercaseMatches.length < PASSWORD_VALIDATION.MIN_LOWERCASE
    ) {
      newErrors.push(PASSWORD_VALIDATION.ERROR_MESSAGES.REQUIRED_CHARS);
    }

    // 特殊文字のチェック
    const specialCharMatches = password.match(
      PASSWORD_VALIDATION.PATTERN.SPECIAL_CHAR
    );
    if (
      !specialCharMatches ||
      specialCharMatches.length < PASSWORD_VALIDATION.MIN_SPECIAL_CHAR
    ) {
      newErrors.push(PASSWORD_VALIDATION.ERROR_MESSAGES.MIN_SPECIAL_CHAR);
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  return { errors, validatePassword };
};

/**
 * メールアドレスのバリデーションフック
 * @returns メールアドレスのバリデーションフック
 */
export const useEmailValidation = (): {
  errors: string[];
  validateEmail: (email: string) => boolean;
} => {
  const [errors, setErrors] = useState<string[]>([]);

  const validateEmail = (email: string): boolean => {
    const newErrors: string[] = [];

    // 必須チェック
    if (!email) {
      newErrors.push(EMAIL_VALIDATION.ERROR_MESSAGES.REQUIRED);
      setErrors(newErrors);
      return false;
    }

    // 長さのチェック
    if (email.length > EMAIL_VALIDATION.MAX_LENGTH) {
      newErrors.push(
        `メールアドレスは${EMAIL_VALIDATION.MAX_LENGTH}文字以下で入力してください`
      );
    }

    // フォーマットチェック
    if (!EMAIL_VALIDATION.PATTERN.test(email)) {
      newErrors.push(EMAIL_VALIDATION.ERROR_MESSAGES.INVALID);
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  return { errors, validateEmail };
};

/**
 * 名前のバリデーションフック
 * @returns 名前のバリデーションフック
 */
export const useNameValidation = (): {
  errors: string[];
  validateName: (name: string) => boolean;
} => {
  const [errors, setErrors] = useState<string[]>([]);

  const validateName = (name: string): boolean => {
    const newErrors: string[] = [];

    // 必須チェック
    if (!name) {
      newErrors.push(NAME_VALIDATION.ERROR_MESSAGES.REQUIRED);
      setErrors(newErrors);
      return false;
    }

    // 長さのチェック
    if (name.length < NAME_VALIDATION.MIN_LENGTH) {
      newErrors.push(NAME_VALIDATION.ERROR_MESSAGES.MIN_LENGTH);
    }
    if (name.length > NAME_VALIDATION.MAX_LENGTH) {
      newErrors.push(NAME_VALIDATION.ERROR_MESSAGES.MAX_LENGTH);
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  return { errors, validateName };
};
