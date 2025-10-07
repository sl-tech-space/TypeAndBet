"use client";

import Image from "next/image";

import { type ReactElement } from "react";

import styles from "./Icon.module.scss";

import type { IconProps, IconSize } from "./Icon.types";

/**
 * デフォルトのアイコンサイズ（ピクセル単位）
 */
const DEFAULT_SIZES: Record<IconSize, { width: number; height: number }> = {
  xs: { width: 32, height: 32 },
  sm: { width: 48, height: 48 },
  md: { width: 64, height: 64 },
  lg: { width: 96, height: 96 },
  xl: { width: 128, height: 128 },
  xxl: { width: 160, height: 160 },
};

/**
 * クライアントコンポーネント
 * カスタマイズ可能なアイコンコンポーネント
 * @param icon アイコンのURL
 * @param alt 代替テキスト
 * @param width 幅（sizeを指定する場合は不要）
 * @param height 高さ（sizeを指定する場合は不要）
 * @param size アイコンのサイズ（xs, sm, md, lg, xl, xxl）
 * xs: 16px, sm: 24px, md: 32px, lg: 48px, xl: 64px, xxl: 160px
 * @param effect 特殊効果（none, glow, pulse）
 * @param isBorder ボーダーを表示するか
 * @param borderColor ボーダーの色（isBorderがtrueの場合必須）
 * @param isRound 丸いアイコンにするか
 * @param hasHoverEffect ホバー時の効果を有効にするか
 * @param className 追加のクラス名
 * @returns アイコンコンポーネント
 */
export const Icon = ({
  icon,
  alt,
  width,
  height,
  size = "md",
  effect = "none",
  isBorder,
  borderColor = "primary",
  isRound,
  hasHoverEffect,
  className = "",
}: IconProps): ReactElement => {
  // サイズの決定（個別指定、またはプリセットサイズ）
  const finalWidth = width || DEFAULT_SIZES[size].width;
  const finalHeight = height || DEFAULT_SIZES[size].height;

  // アイコンURLのバリデーション
  const isValidUrl = (url: string): boolean => {
    try {
      // 相対パス（/で始まる）または絶対URLをチェック
      if (url.startsWith("/")) return true;
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidIcon =
    icon &&
    typeof icon === "string" &&
    icon.trim() !== "" &&
    isValidUrl(icon.trim());
  const defaultIcon = "/assets/images/default-icon.png"; // デフォルトアイコンのパス
  const iconSrc = isValidIcon ? icon : defaultIcon;

  return (
    <div
      className={`
        ${styles.icon}
        ${isBorder ? styles.border : ""}
        ${isBorder ? styles[borderColor] : ""}
        ${isRound ? styles.round : ""}
        ${effect !== "none" ? styles[effect] : ""}
        ${hasHoverEffect ? styles.hoverEffect : ""}
        ${styles[size]}
        ${className}
      `}
    >
      <Image
        src={iconSrc}
        alt={alt}
        width={finalWidth}
        height={finalHeight}
        className={styles.image}
      />
    </div>
  );
};
