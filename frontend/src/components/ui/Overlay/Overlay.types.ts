import { type ReactNode } from "react";

/**
 * オーバーレイコンポーネントのプロパティ
 */
export interface OverlayProps {
  /** オーバーレイ内に表示するコンテンツ */
  children: ReactNode;
  /** オーバーレイが表示されているかどうか */
  isVisible?: boolean;
  /** 追加のクラス名 */
  className?: string;
}
