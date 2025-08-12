import { CommonColor, CommonSize } from "@/types";

type ButtonType = "button" | "submit" | "reset";

/**
 * ボタンの基本プロパティ
 */
type BaseButtonProps = {
  children: React.ReactNode;
  textColor?: CommonColor;
  backgroundColor?: CommonColor;
  buttonSize?: CommonSize;
  type?: ButtonType;
  isDisabled?: boolean;
  isLoading?: boolean;
  isRound?: boolean;
  className?: string;
  onClick?: () => void;
};

/**
 * ボーダーなしボタンのプロパティ
 */
type ButtonWithoutBorderProps = BaseButtonProps & {
  isBorder?: false;
  borderColor?: never;
};

/**
 * ボーダーありボタンのプロパティ
 */
type ButtonWithBorderProps = BaseButtonProps & {
  isBorder: true;
  borderColor: CommonColor;
};

/**
 * ボタンのプロパティ（条件付き型）
 */
export type ButtonProps = ButtonWithoutBorderProps | ButtonWithBorderProps;
