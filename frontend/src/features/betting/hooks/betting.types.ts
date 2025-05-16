/**
 * ベッティング機能用のカスタムフックのプロパティ
 */
export interface UseBettingProps {
  /** ベット実行関数 */
  onBet?: (amount: number) => Promise<{ success: boolean; error?: string }>;
  /** ユーザーの残高 */
  balance: number;
  /** 最小ベット額 */
  minBet?: number;
  /** 最大ベット額 */
  maxBet?: number;
  /** ゲームモード識別子 */
  gameModeId: string;
}

/**
 * ベッティング機能用のカスタムフックの戻り値
 */
export interface UseBettingReturn {
  /** ベット額 */
  betAmount: number;
  /** ベット額設定関数 */
  setBetAmount: (amount: number) => void;
  /** 現在の制限時間（秒） */
  timeLimit: number;
  /** 送信中状態 */
  isSubmitting: boolean;
  /** ベット額が残高を超えているかどうか */
  isExceedingBalance: boolean;
  /** エラー情報 */
  error: string | null;
  /** ベット処理関数 */
  handleBet: () => Promise<void>;
  /** キャンセル処理関数 */
  handleCancel: () => void;
  /** アニメーション付きの表示用残高 */
  displayBalance: number;
}
