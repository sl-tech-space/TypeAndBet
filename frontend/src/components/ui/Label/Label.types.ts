import { CommonColor } from "@/types";

export type LabelProps = {
  htmlFor: string;
  color?: CommonColor;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}; 