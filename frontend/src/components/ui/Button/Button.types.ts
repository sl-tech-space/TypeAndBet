import { CommonColor, CommonSize } from "@/types";

type ButtonType = "button" | "submit" | "reset";

export type ButtonProps = {
  children: React.ReactNode;
  textColor?: CommonColor;
  backgroundColor?: CommonColor;
  borderColor?: CommonColor;
  buttonSize?: CommonSize;
  type?: ButtonType;
  isDisabled?: boolean;
  isLoading?: boolean;
  isRound?: boolean;
  className?: string;
  onClick?: () => void;
};

