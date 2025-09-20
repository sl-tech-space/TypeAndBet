/**
 * パスワードリセットの状態
 */
export type PasswordResetState = "idle" | "submitting" | "success" | "error";

/**
 * usePasswordResetの戻り値の型
 */
export type UsePasswordResetReturn = {
  password: string;
  passwordConfirm: string;
  token: string;
  state: PasswordResetState;
  message: string;
  handlePasswordChange: (password: string) => void;
  handlePasswordConfirmChange: (passwordConfirm: string) => void;
  handleSubmit: () => Promise<void>;
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  passwordErrors: string[];
  passwordConfirmError: string;
  hasInteracted: boolean;
  isTokenValid: boolean;
};
