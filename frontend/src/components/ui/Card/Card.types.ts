import React from "react";
import { CommonColor, CommonSize } from "@/types";

/**
 * カードのバリアント
 */
export type CardVariant = "default" | "elevated" | "bordered";

/**
 * パディングサイズ
 */
export type PaddingSize = "none" | "small" | "medium" | "large";

/**
 * カードの基本プロパティ
 */
export type CardProps = {
  children: React.ReactNode;
  variant?: CardVariant;
  backgroundColor?: CommonColor;
  isBorder?: boolean;
  borderColor?: CommonColor;
  isRound?: boolean;
  isHoverable?: boolean;
  hasShadow?: boolean;
  shadowColor?: CommonColor;
  padding?: PaddingSize;
  size?: CommonSize;
  className?: string;
};
