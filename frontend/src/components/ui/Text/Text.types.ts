import { ReactNode } from "react";
import { CommonColor } from "@/types";

type TextVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
type TextSize = "auto" | "small" | "medium" | "large" | "xlarge" | "xxlarge";

export type TextProps = {
  variant?: TextVariant;
  size?: TextSize;
  color?: CommonColor | ""; //カスタムクラス用に空文字を許可
  children: ReactNode;
  className?: string;
};
