import { CommonColor, CommonSize } from "@/types";

type InputType = "text" | "password" | "email" | "number" | "tel" | "url";

/**
 * 入力フォームの基本プロパティ
 */
type BaseInputProps = {
  type: InputType;
  id?: string;
  placeholder?: string;
  value?: string;
  textColor?: CommonColor;
  backgroundColor?: CommonColor;
  isDisabled?: boolean;
  inputSize?: CommonSize;
  isRound?: boolean;
  autoComplete?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

/**
 * ボーダーなし入力フォームのプロパティ
 */
type InputWithoutBorderProps = BaseInputProps & {
  isBorder?: false;
  borderColor?: never;
};

/**
 * ボーダーあり入力フォームのプロパティ
 */
type InputWithBorderProps = BaseInputProps & {
  isBorder: true;
  borderColor: CommonColor;
};

export type InputProps = InputWithoutBorderProps | InputWithBorderProps;
