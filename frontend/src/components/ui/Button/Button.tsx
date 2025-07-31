"use client";

import { type ReactElement } from "react";

import styles from "./Button.module.scss";

import type { ButtonProps } from "./Button.types";

/**
 * クライアントコンポーネント
 * ボタンを表示するコンポーネント
 * @param children ボタンの内容
 * @param textColor テキストの色(デフォルトはprimary)
 * 色：primary, secondary, tertiary, accent, gold
 * @param backgroundColor 背景の色(デフォルトはprimary)
 * 色：primary, secondary, tertiary, accent, gold
 * @param isBorder ボーダーを表示するかどうか(デフォルトはtrue)
 * @param borderColor ボーダーの色(デフォルトはprimary、isBorderがtrueの場合のみ有効)
 * 色：primary, secondary, tertiary, accent, gold
 * @param buttonSize ボタンのサイズ(デフォルトはmedium)
 * サイズ：small, medium, large
 * @param type ボタンの型(デフォルトはbutton)
 * 型：button, submit, reset
 * @param isDisabled ボタンが無効化されているかどうか(デフォルトはfalse)
 * @param isLoading ボタンがローディング中かどうか(デフォルトはfalse)
 * @param isRound ボタンが丸くなっているかどうか(デフォルトはfalse)
 * @param className クラス名
 * @param onClick クリック時の処理
 * @returns ボタンを表示するコンポーネント
 */
export const Button = ({
  children,
  textColor = "primary",
  backgroundColor = "primary",
  isBorder = true,
  borderColor = "primary",
  buttonSize = "medium",
  type = "button",
  isDisabled = false,
  isLoading = false,
  isRound = false,
  className = "",
  onClick = () => {},
}: ButtonProps): ReactElement => {
  return (
    <button
      type={type}
      className={`${styles[buttonSize]} ${styles[`${textColor}-text`]} ${
        styles[`${backgroundColor}-background`]
      } ${isBorder ? styles[`${borderColor}-border`] : ""} ${
        isDisabled ? styles.disabled : ""
      } ${isLoading ? styles.loading : ""} ${
        isRound ? styles.round : ""
      } ${className}`}
      disabled={isDisabled || isLoading}
      onClick={onClick}
    >
      <div
        className={`${styles.button__content} ${
          isLoading ? styles.loading__content : ""
        }`}
      >
        {children}
      </div>
      {isLoading && <div className={styles.loading__spinner} />}
    </button>
  );
};
