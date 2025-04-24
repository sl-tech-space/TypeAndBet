import { ReactNode } from "react";

/**
 * オーバーレイコンポーネントのプロパティ
 */
export interface OverlayProps {
  /** オーバーレイ内に表示するコンテンツ */
  children: ReactNode;
  /** オーバーレイが表示されているかどうか */
  isVisible?: boolean;
  className?: string;
}
