import { useState, useCallback } from "react";

/**
 * サブミット状態を管理するカスタムフック
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { isSubmitting, withSubmitting } = useSubmitting();
 *
 *   const handleSubmit = withSubmitting(async () => {
 *     await someApiCall();
 *   });
 *
 *   return (
 *     <button disabled={isSubmitting} onClick={handleSubmit}>
 *       {isSubmitting ? "送信中..." : "送信"}
 *     </button>
 *   );
 * };
 * ```
 */
export const useSubmitting = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * サブミット状態を管理する高階関数
   * 実行中はisSubmittingをtrueに設定し、完了後にfalseに戻す
   */
  const withSubmitting = useCallback(<T>(fn: () => Promise<T>) => {
    return async (): Promise<T> => {
      setIsSubmitting(true);
      try {
        return await fn();
      } finally {
        setIsSubmitting(false);
      }
    };
  }, []);

  return {
    /** 現在のサブミット状態 */
    isSubmitting,
    /** サブミット状態を直接設定する */
    setIsSubmitting,
    /** 関数にサブミット状態の管理を追加する */
    withSubmitting,
  };
};
