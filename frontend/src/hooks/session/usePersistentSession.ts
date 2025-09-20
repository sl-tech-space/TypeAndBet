"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";

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
    // ユーザーがログインしていない場合はスキップ
    if (!session?.user?.id) {
      return;
    }

    setIsSyncing(true);

    try {
      // サーバーから最新ゴールドを取得（10秒でタイムアウトし中断）
      const TIMEOUT_MS = 10_000;
      const withTimeout = async <T>(p: Promise<T>, ms: number): Promise<T> =>
        await new Promise<T>((resolve, reject) => {
          const t = setTimeout(() => reject(new Error("sync timeout")), ms);
          p.then((v) => {
            clearTimeout(t);
            resolve(v);
          }).catch((e) => {
            clearTimeout(t);
            reject(e);
          });
        });

      const { getUserGold } = await import("@/actions/userSession");
      const freshGold = await withTimeout(getUserGold(), TIMEOUT_MS);

      // セッションを更新
      await update({
        user: {
          ...session.user,
          gold: freshGold,
        },
      });
    } catch {
      // タイムアウト/その他エラーはいったん無視して同期を中断
    } finally {
      setIsSyncing(false);
    }
  }, [session?.user, update]);

  // 定期的なゴールド同期（10秒間隔）
  useEffect(() => {
    // ユーザーがログインしていない場合はスキップ
    if (!session?.user?.id) {
      return;
    }

    const startPolling = (): void => {
      if (intervalRef.current) return; // 既にポーリング中

      intervalRef.current = setInterval(async () => {
        if (!isSyncing) {
          // 手動同期中でなければ実行
          try {
            await syncGold();
          } catch {
            // エラーは無視
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
