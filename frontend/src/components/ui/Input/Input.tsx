"use client";

import { type ReactElement } from "react";

import styles from "./Input.module.scss";

import type { InputProps } from "./Input.types";

/**
 * クライアントコンポーネント
 * 入力フォーム
 * @param type 入力タイプ
 * @param placeholder プレースホルダー
 * @param value 入力値
 * @param textColor テキストの色(デフォルトはprimary)
 * @param backgroundColor 背景の色(デフォルトはprimary)
 * @param isDisabled 無効化されているかどうか(デフォルトはfalse)
 * @param isBorder ボーダーを表示するかどうか(デフォルトはtrue)
 * @param borderColor ボーダーの色(デフォルトはprimary)
 * @param inputSize 入力フォームのサイズ(デフォルトはmedium)
 * @param isRound 角を丸くするかどうか(デフォルトはfalse)
 * @param className クラス名
 * @param onChange 入力値変更時の処理
 * @returns 入力フォーム
 */
export const Input = ({
  type,
  placeholder,
  value,
  textColor = "primary",
  backgroundColor = "primary",
  isDisabled = false,
  isBorder = true,
  borderColor = "primary",
  inputSize = "medium",
  isRound = false,
  autoComplete = "on",
  className = "",
  onChange,
}: InputProps): ReactElement => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      disabled={isDisabled}
      className={`${styles[inputSize]} ${styles[`${textColor}-text`]} ${
        styles[`${backgroundColor}-background`]
      } ${isBorder ? styles[`${borderColor}-border`] : ""} ${
        isDisabled ? styles.disabled : ""
      } ${isRound ? styles.round : ""} ${className}`}
      onChange={onChange}
      autoComplete={autoComplete}
    />
  );
};
