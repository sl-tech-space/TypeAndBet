/**
 * パスワードリセット要求の状態
 */
export type PasswordForgetState = "idle" | "submitting" | "success" | "error";

/**
 * usePasswordForgetの戻り値の型
 */
export type UsePasswordForgetReturn = {
  email: string;
  setEmail: (email: string) => void;
  state: PasswordForgetState;
  message: string;
  handleSubmit: () => Promise<void>;
  handleEmailChange: (email: string) => void;
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  emailErrors: string[];
  hasInteracted: boolean;
};
