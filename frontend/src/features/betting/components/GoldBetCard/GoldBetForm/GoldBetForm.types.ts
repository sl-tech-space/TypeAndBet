/**
 * ゴールドベットフォームのプロパティ（クライアントコンポーネント用）
 */
export interface GoldBetFormProps {
  /** ベット確定時の関数（ベット額を引数に取る） */
  onBet?: (amount: number) => Promise<{ success: boolean; error?: string }>;
  /** 現在の残高 */
  balance: number;
  /** ローディング状態 */
  isLoading?: boolean;
  /** 最小ベット額 */
  minBet?: number;
  /** 最大ベット額 */
  maxBet?: number;
  /** ゲームモード識別子 */
  gameModeId: string;
} 