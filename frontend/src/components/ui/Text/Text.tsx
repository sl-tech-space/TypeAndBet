import styles from "./Text.module.scss";
import { TextProps } from "./Text.types";

/**
 * サーバコンポーネント
 * テキストを表示するコンポーネント
 * @param variant テキストの種類(デフォルトはpタグ)
 * 種類：h1, h2, h3, h4, h5, h6, p
 * @param size テキストのサイズ(デフォルトはmedium)
 * サイズ：auto(タグのサイズに合わせる), small, medium, large, xlarge, xxlarge
 * 画面幅768px以下では１サイズ小さくなる
 * @param color テキストの色(デフォルトはprimary)
 * 色：primary, secondary, tertiary, accent, gold
 * @param children テキストの内容
 * @param className クラス名
 * @returns テキストを表示するコンポーネント
 */
export const Text = ({
  variant = "p",
  size = "auto",
  color = "",
  children,
  className = "",
}: TextProps) => {
  const Component = variant;
  return (
    <Component
      className={`${styles[variant]} ${styles[size]} ${styles[color]} ${className}`}
    >
      {children}
    </Component>
  );
};

export default Text;
