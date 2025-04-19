import { ReactNode } from "react";

type TextVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
type TextSize = "auto" | "small" | "medium" | "large" | "xlarge" | "xxlarge";

export type TextProps = {
  variant?: TextVariant;
  size?: TextSize;
  children: ReactNode;
  className?: string;
};
