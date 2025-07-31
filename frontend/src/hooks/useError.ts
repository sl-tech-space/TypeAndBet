import { useState, useCallback } from "react";

/**
 * エラー情報の型定義
 */
export interface ErrorState {
  /** エラーメッセージ */
  message: string;
  /** エラーコード */
  code?: string;
  /** エラーの詳細情報 */
  details?: unknown;
}

/**
 * エラー処理用のカスタムフック
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { error, setError, clearError, handleError } = useError();
 *
 *   const handleSubmit = async () => {
 *     try {
 *       await someAsyncFunction();
 *     } catch (err) {
 *       handleError(err);
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       {error && <div className="error">{error.message}</div>}
 *       <button onClick={handleSubmit}>Submit</button>
 *     </div>
 *   );
 * };
 * ```
 */
export const useError = (): {
  error: ErrorState | null;
  setError: (error: ErrorState | null) => void;
  clearError: () => void;
  handleError: (err: unknown) => void;
  withErrorHandling: <T>(
    fn: () => Promise<T>,
    customErrorHandler?: (err: unknown) => void
  ) => () => Promise<T>;
} => {
  // エラー状態の管理
  const [error, setError] = useState<ErrorState | null>(null);

  // エラーをクリアする
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // エラーを適切な形式に変換して設定する
  const handleError = useCallback((err: unknown) => {
    if (err instanceof Error) {
      setError({
        message: err.message,
        details: err,
      });
    } else if (typeof err === "string") {
      setError({
        message: err,
      });
    } else if (err && typeof err === "object" && "message" in err) {
      setError({
        message: String(err.message),
        details: err,
      });
    } else {
      setError({
        message: "予期せぬエラーが発生しました",
        details: err,
      });
    }
  }, []);

  // エラー処理をラップする高階関数
  const withErrorHandling = useCallback(
    <T>(fn: () => Promise<T>, customErrorHandler?: (err: unknown) => void) => {
      return async (): Promise<T> => {
        try {
          return await fn();
        } catch (err) {
          if (customErrorHandler) {
            customErrorHandler(err);
          } else {
            handleError(err);
          }
          throw err;
        }
      };
    },
    [handleError]
  );

  return {
    /** 現在のエラー状態 */
    error,
    /** エラー状態を直接設定する */
    setError,
    /** エラー状態をクリアする */
    clearError,
    /** エラーを適切な形式に変換して設定する */
    handleError,
    /** 関数にエラー処理を追加する */
    withErrorHandling,
  };
};
