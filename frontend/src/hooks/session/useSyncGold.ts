"use client";

import { useSession } from "next-auth/react";
import { useCallback } from "react";

import { getUserGold } from "@/actions/userSession";

/**
 * ゴールド手動同期専用フック
 * 呼び出すだけでサーバーから最新のゴールドを取得してセッションを更新
 * @returns ゴールド同期関数
 */
export const useSyncGold = (): (() => Promise<void>) => {
  const { data: session, update } = useSession();

  const syncGold = useCallback(async (): Promise<void> => {
    if (!session?.user?.id) {
      // ユーザーがログインしていない場合はスキップ
      return;
    }

    try {
      const freshGold = await getUserGold();
      await update({
        user: {
          ...session.user,
          gold: freshGold,
        },
      });
    } catch {
      // エラーは無視
    }
  }, [session, update]);

  return syncGold;
};

export default useSyncGold;
