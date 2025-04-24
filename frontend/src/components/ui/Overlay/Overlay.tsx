import styles from "./Overlay.module.scss";
import type { OverlayProps } from "./Overlay.types";

/**
 * オーバーレイコンポーネント（サーバーコンポーネント）
 * 子コンポーネントの周りに半透明のオーバーレイ（ブラー背景）を表示
 * @param children オーバーレイ内に表示するコンテンツ
 * @param isVisible オーバーレイが表示されているかどうか
 * @param className 追加のクラス名
 * @returns オーバーレイコンポーネント
 */
export const Overlay = ({
  children,
  isVisible = true,
  className = "",
}: OverlayProps) => {
  if (!isVisible) return null;

  return (
    <div className={styles["overlay"]}>
      <div className={`${styles["overlay__content"]} ${className}`}>
        {children}
      </div>
    </div>
  );
};
