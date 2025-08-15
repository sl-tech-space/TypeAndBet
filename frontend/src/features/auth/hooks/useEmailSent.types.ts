/**
 * 再送信の状態を管理するタイプ
 */
export type ResendState = "idle" | "sending" | "success" | "error" | "cooldown";

/**
 * useEmailSentフックの戻り値の型
 */
export type UseEmailSentReturn = {
  resendState: ResendState;
  cooldownTime: number;
  resendMessage: string;
  handleResendEmail: (email: string) => Promise<void>;
};
