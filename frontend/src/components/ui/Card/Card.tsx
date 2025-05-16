import styles from "./Card.module.scss";
import type { CardProps } from "./";

/**
 * サーバコンポーネント
 * カードを表示するコンポーネント
 * @param children カードの内容
 * @param variant カードの種類(デフォルトはdefault)
 * 種類：default, elevated, bordered
 * default: デフォルトのカード
 * elevated: シャドウを表示するカード
 * bordered: ボーダーを表示するカード
 * @param backgroundColor 背景の色(デフォルトはsecondary)
 * 色：primary, secondary, tertiary, accent, gold
 * @param isBorder ボーダーを表示するかどうか(デフォルトはfalse)
 * @param borderColor ボーダーの色(デフォルトはprimary、isBorderがtrueの場合のみ有効)
 * 色：primary, secondary, tertiary, accent, gold
 * @param isRound カードが丸くなっているかどうか(デフォルトはfalse)
 * @param isHoverable ホバー時にカードが変化するかどうか(デフォルトはtrue)
 * @param hasShadow シャドウを表示するかどうか(デフォルトはtrue)
 * @param shadowColor シャドウの色(デフォルトはprimary、hasShadowがtrueの場合のみ有効)
 * 色：primary, secondary, tertiary, accent, gold
 * @param padding パディングのサイズ(デフォルトはmedium)
 * サイズ：none, small, medium, large
 * @param className クラス名
 * @returns カードを表示するコンポーネント
 */
export const Card = ({
  children,
  variant = "default",
  backgroundColor = "secondary",
  isBorder = false,
  borderColor = "primary",
  isRound = false,
  isHoverable = true,
  hasShadow = true,
  shadowColor = "primary",
  padding = "medium",
  size = "medium",
  className = "",
}: CardProps) => {
  return (
    <div
      className={`
        ${styles.card}
        ${styles[variant]}
        ${styles[`${backgroundColor}-background`]}
        ${isBorder ? styles[`${borderColor}-border`] : ""}
        ${isRound ? styles.round : ""}
        ${isHoverable ? styles.hoverable : ""}
        ${hasShadow ? styles[`${shadowColor}-shadow`] : ""}
        ${styles[`padding-${padding}`]}
        ${styles[`size-${size}`]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
