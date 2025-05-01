import { useCallback } from "react";
import { useError } from "./useError";
import { useLoading } from "./useLoading";
import { useSubmitting } from "./useSubmitting";

/**
 * 非同期処理の状態を総合的に管理するカスタムフック
 * エラー処理、ローディング状態、サブミット状態を組み合わせる
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const {
 *     error,
 *     isLoading,
 *     isSubmitting,
 *     withAsyncLoading,
 *     withAsyncSubmit
 *   } = useAsyncState();
 *
 *   // データ取得
 *   const fetchData = withAsyncLoading(async () => {
 *     const data = await fetchSomeData();
 *     return data;
 *   });
 *
 *   // フォーム送信
 *   const handleSubmit = withAsyncSubmit(async () => {
 *     await submitForm();
 *   });
 *
 *   if (isLoading) return <Spinner />;
 *
 *   return (
 *     <form>
 *       {error && <div className="error">{error.message}</div>}
 *       <button disabled={isSubmitting} onClick={handleSubmit}>
 *         {isSubmitting ? "送信中..." : "送信"}
 *       </button>
 *     </form>
 *   );
 * };
 * ```
 */
export const useAsyncState = () => {
  const { error, handleError, clearError } = useError();
  const { isLoading, withLoading } = useLoading();
  const { isSubmitting, withSubmitting } = useSubmitting();

  /**
   * エラー処理とローディング状態を組み合わせた高階関数
   */
  const withAsyncLoading = useCallback(
    <T>(fn: () => Promise<T>, customErrorHandler?: (err: unknown) => void) => {
      return withLoading(async () => {
        try {
          clearError();
          return await fn();
        } catch (err) {
          if (customErrorHandler) {
            customErrorHandler(err);
          } else {
            handleError(err);
          }
          throw err;
        }
      });
    },
    [withLoading, handleError, clearError]
  );

  /**
   * エラー処理とサブミット状態を組み合わせた高階関数
   */
  const withAsyncSubmit = useCallback(
    <T>(fn: () => Promise<T>, customErrorHandler?: (err: unknown) => void) => {
      return withSubmitting(async () => {
        try {
          clearError();
          return await fn();
        } catch (err) {
          if (customErrorHandler) {
            customErrorHandler(err);
          } else {
            handleError(err);
          }
          throw err;
        }
      });
    },
    [withSubmitting, handleError, clearError]
  );

  return {
    /** 現在のエラー状態 */
    error,
    /** 現在のローディング状態 */
    isLoading,
    /** 現在のサブミット状態 */
    isSubmitting,
    /** 処理中かどうか（ローディングまたはサブミット中） */
    isProcessing: isLoading || isSubmitting,
    /** 関数にエラー処理とローディング状態の管理を追加する */
    withAsyncLoading,
    /** 関数にエラー処理とサブミット状態の管理を追加する */
    withAsyncSubmit,
  };
};
