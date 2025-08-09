"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef, useCallback } from "react";

import type { User } from "@/types";

/**
 * 同期中にユーザー情報を保持するセッションフック
 * 同期中は前の情報を表示し、完了後にスムーズに更新
 * @returns 保持されたユーザー情報と同期状態
 */
export const usePersistentSession = (): {
  /** 保持されたユーザー情報（同期中でも維持） */
  persistentUser: User | undefined;
  /** 認証状態 */
  isAuthenticated: boolean;
  /** アクセストークン */
  accessToken: string | undefined;
  /** ローディング状態 */
  isLoading: boolean;
  /** ゴールド同期中かどうか */
  isSyncing: boolean;
  /** ゴールド同期関数 */
  syncGold: () => Promise<void>;
} => {
  const { data: session, status, update } = useSession();
  const [persistentUser, setPersistentUser] = useState<User | undefined>(() => {
    // 初期化時にセッションが存在すれば即座に設定
    if (session?.user && status === "authenticated") {
      return {
        ...session.user,
        icon: session.user.icon ?? null,
        createdAt: (session.user as User).createdAt ?? "",
        updatedAt: (session.user as User).updatedAt ?? "",
      } as User;
    }
    return undefined;
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const lastValidUserRef = useRef<User | undefined>(undefined);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // セッションからユーザー情報を取得・保持
  useEffect(() => {
    if (session?.user && status === "authenticated") {
      const currentUser = {
        ...session.user,
        icon: session.user.icon ?? null,
        createdAt: (session.user as User).createdAt ?? "",
        updatedAt: (session.user as User).updatedAt ?? "",
      } as User;

      // 有効なユーザー情報を保持
      lastValidUserRef.current = currentUser;

      // 同期中でなければ更新（同期中は保持）
      if (!isSyncing) {
        setPersistentUser(currentUser);
      }
    } else if (status === "unauthenticated") {
      // 明確にログアウトした場合のみクリア
      setPersistentUser(undefined);
      lastValidUserRef.current = undefined;
    }
  }, [session, status, isSyncing]);

  // ゴールド同期関数（UI保持機能付き）
  const syncGold = useCallback(async (): Promise<void> => {
    if (!session?.user?.id) {
      console.warn(
        "ユーザーがログインしていないため、ゴールド同期をスキップします"
      );
      return;
    }

    setIsSyncing(true);

    try {
      // サーバーから最新ゴールドを取得
      const { getUserGold } = await import("@/actions/userSession");
      const freshGold = await getUserGold();

      // セッションを更新
      await update({
        user: {
          ...session.user,
          gold: freshGold,
        },
      });
    } catch (error) {
      console.error("ゴールド同期エラー:", error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, [session?.user, update]);

  // 定期的なゴールド同期（30秒間隔）
  useEffect(() => {
    const startPolling = (): void => {
      if (intervalRef.current) return; // 既にポーリング中

      intervalRef.current = setInterval(async () => {
        if (!isSyncing) {
          // 手動同期中でなければ実行
          try {
            await syncGold();
          } catch (error) {
            console.error("定期ゴールド同期エラー:", error);
          }
        }
      }, 10000); // 10秒間隔
    };

    const stopPolling = (): void => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    if (status === "authenticated" && session?.user?.id) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => stopPolling();
  }, [status, session?.user?.id, syncGold, isSyncing]);

  return {
    persistentUser,
    isAuthenticated: status === "authenticated",
    accessToken: session?.accessToken,
    isLoading: status === "loading",
    isSyncing,
    syncGold,
  };
};

export default usePersistentSession;
