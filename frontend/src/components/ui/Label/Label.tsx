"use client";

import { type ReactElement } from "react";

import styles from "./Label.module.scss";

import type { LabelProps } from "./Label.types";

/**
 * クライアントコンポーネント
 * ラベルを表示するコンポーネント
 * @param htmlFor 紐付ける入力要素のID
 * @param color ラベルの色(デフォルトはprimary)
 * @param required 必須項目かどうか(デフォルトはfalse)
 * @param children ラベルの内容
 * @param className クラス名
 * @returns ラベルを表示するコンポーネント
 */
export const Label = ({
  htmlFor,
  color = "primary",
  required = false,
  children,
  className = "",
}: LabelProps): ReactElement => {
  return (
    <label
      htmlFor={htmlFor}
      className={`${styles.label} ${styles[color]} ${
        required ? styles.required : ""
      } ${className}`}
    >
      {children}
    </label>
  );
};
