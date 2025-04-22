import { CommonColor } from "@/types";

/**
 * アイコンのサイズ
 */
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/**
 * アイコンの特殊効果
 */
export type IconEffect = 'none' | 'glow' | 'pulse';

/**
 * アイコンの基本プロパティ
 */
type BaseIconProps = {
  icon: string;
  alt: string;
  width?: number;
  height?: number;
  size?: IconSize;
  effect?: IconEffect;
  isRound?: boolean;
  hasHoverEffect?: boolean;
  className?: string;
};

/**
 * ボーダーなしアイコンのプロパティ
 */
type IconWithoutBorderProps = BaseIconProps & {
  isBorder?: false;
  borderColor?: never;
};

/**
 * ボーダーありアイコンのプロパティ
 */
type IconWithBorderProps = BaseIconProps & {
  isBorder: true;
  borderColor: CommonColor;
};

/**
 * アイコンのプロパティ（条件付き型）
 */
export type IconProps = IconWithoutBorderProps | IconWithBorderProps;

