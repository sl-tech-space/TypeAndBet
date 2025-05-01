import { useState, useCallback } from "react";

/**
 * データ読み込み状態を管理するカスタムフック
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { isLoading, withLoading } = useLoading();
 *
 *   const fetchData = withLoading(async () => {
 *     const data = await fetchSomeData();
 *     return data;
 *   });
 *
 *   return (
 *     <div>
 *       {isLoading ? (
 *         <Spinner />
 *       ) : (
 *         <DataDisplay />
 *       )}
 *     </div>
 *   );
 * };
 * ```
 */
export const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * ローディング状態を管理する高階関数
   * 実行中はisLoadingをtrueに設定し、完了後にfalseに戻す
   */
  const withLoading = useCallback(<T>(fn: () => Promise<T>) => {
    return async (): Promise<T> => {
      setIsLoading(true);
      try {
        return await fn();
      } finally {
        setIsLoading(false);
      }
    };
  }, []);

  return {
    /** 現在のローディング状態 */
    isLoading,
    /** ローディング状態を直接設定する */
    setIsLoading,
    /** 関数にローディング状態の管理を追加する */
    withLoading,
  };
};
