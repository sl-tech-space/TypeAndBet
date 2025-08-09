"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef } from "react";

import { getUserGold } from "@/actions/userSession";

/**
 * 楽観的ゴールド更新フック
 * ベット処理時の即座の更新と定期的な正確な値の取得を行う
 * @returns ゴールド管理機能
 */
export const useOptimisticGold = (): {
  /** 楽観的にゴールドを更新する関数 */
  updateGoldOptimistically: (betAmount: number) => void;
  /** 手動でゴールドを同期する関数 */
  syncGold: () => Promise<void>;
  /** ポーリング状態 */
  isPolling: boolean;
} => {
  const { data: session, update } = useSession();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef(false);

  // 楽観的ゴールド更新（ベット直後の即座更新用）
  const updateGoldOptimistically = useCallback(
    (betAmount: number) => {
      if (!session?.user) return;

      const currentGold = session.user.gold || 0;
      const newGold = Math.max(0, currentGold - betAmount); // 負の値にならないように

      update({
        user: {
          ...session.user,
          gold: newGold,
        },
      });
    },
    [session, update]
  );

  // サーバーアクションを使用した手動同期
  const syncGold = useCallback(async (): Promise<void> => {
    if (!session?.user?.id) return;

    try {
      const freshGold = await getUserGold();
      await update({
        user: {
          ...session.user,
          gold: freshGold,
        },
      });
    } catch (error) {
      console.error("ゴールド同期エラー:", error);
    }
  }, [session, update]);

  // サーバーアクションベースのポーリング制御
  useEffect(() => {
    const startPolling = (): void => {
      if (intervalRef.current) return; // 既にポーリング中

      isPollingRef.current = true;
      intervalRef.current = setInterval(async () => {
        try {
          await syncGold();
        } catch (error) {
          console.error("定期ゴールド同期エラー:", error);
        }
      }, 30000); // 30秒間隔
    };

    const stopPolling = (): void => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isPollingRef.current = false;
    };

    if (session?.user?.id) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => stopPolling();
  }, [session?.user?.id, syncGold]);

  return {
    updateGoldOptimistically,
    syncGold,
    isPolling: isPollingRef.current,
  };
};

export default useOptimisticGold;
