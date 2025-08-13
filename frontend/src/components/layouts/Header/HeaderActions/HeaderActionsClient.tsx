"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button, Icon, Text } from "@/components/ui";
import { ROUTE, ROUTE_NAME } from "@/constants";
import { useBaseRouter, useNavigator, usePersistentSession } from "@/hooks";
import { isRevalidateRoute, maskEmail } from "@/utils";

import styles from "./HeaderActions.module.scss";

/**
 * クライアントコンポーネント
 * ヘッダーのアクションコンポーネント
 * インタラクティブな部分を担当するため、クライアントコンポーネントとして実装
 * @returns ヘッダーアクションコンポーネント
 */
export const HeaderActionsClient = (): React.ReactNode => {
  const {
    persistentUser,
    isAuthenticated,
    accessToken,
    isLoading,
    isSyncing,
    syncGold,
  } = usePersistentSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { refresh } = useBaseRouter();
  const { toHome } = useNavigator();
  const hasUpdated = useRef(false);

  // ゴールド同期ロジック（特定ルートでのみ）
  useEffect(() => {
    // ローディング中は何もしない
    if (isLoading) return;

    // 認証されていない場合は何もしない
    if (!isAuthenticated || !persistentUser) return;

    // 既に更新済みの場合は何もしない
    if (hasUpdated.current) return;

    // 現在のパスを取得
    const pathname = window.location.pathname;

    // 再検証ルートの場合、ゴールドを同期（一度だけ）
    if (isRevalidateRoute(pathname)) {
      hasUpdated.current = true;
      syncGold().catch((error) => {
        console.error("ゴールド同期エラー:", error);
      });
    }
  }, [isLoading, isAuthenticated, persistentUser, syncGold]);

  // persistentUserが存在する限り、ログイン済みとして扱う
  const isLoggedIn =
    (persistentUser || (isAuthenticated && accessToken)) && !isLoggingOut;

  const handleLogout = async (): Promise<void> => {
    try {
      setIsLoggingOut(true);
      await signOut({
        redirect: false,
      });
      toHome();
      refresh();
    } catch (error: unknown) {
      console.error("ログアウトエラー:", error);
      setIsLoggingOut(false);
      // エラー処理
    }
  };

  // ログイン済みの場合
  if (isLoggedIn && persistentUser) {
    return (
      <div className={styles.user}>
        <div className={styles["user__info"]}>
          <div className={styles["user__text"]}>
            <Text
              variant="h3"
              color="gold"
              className={styles["user__text__name"]}
            >
              {persistentUser.name || "ゲスト"}
            </Text>
            <Text
              variant="h3"
              color="gold"
              className={styles["user__text__gold"]}
            >
              {(persistentUser.gold || 0).toLocaleString()}G
              {isSyncing && (
                <Icon
                  icon="/assets/svg/sync.svg"
                  alt="同期中"
                  size="xs"
                  className={styles["user__text__sync"]}
                />
              )}
            </Text>
          </div>
          <div className={styles["user__icon-container"]}>
            <div
              className={styles["user__icon"]}
              onClick={() => setIsOpen(!isOpen)}
            >
              <Icon
                icon={persistentUser.icon || "/assets/images/default-icon.png"}
                alt={
                  persistentUser.name
                    ? `${persistentUser.name}のアイコン`
                    : "デフォルトアイコン"
                }
                size="sm"
                isBorder
                borderColor="gold"
                isRound
                hasHoverEffect
                className={styles["user__icon__image"]}
              />
            </div>
            {isOpen && (
              <div className={styles["user__dropdown"]}>
                <div className={styles["user__dropdown__email"]}>
                  <Text variant="h3" color="gold">
                    {persistentUser.email
                      ? maskEmail(persistentUser.email)
                      : "メールアドレスなし"}
                  </Text>
                </div>
                <div className={styles["user__dropdown__button"]}>
                  <Button
                    textColor="secondary"
                    backgroundColor="tertiary"
                    isBorder={true}
                    borderColor="gold"
                    isRound={true}
                    buttonSize="small"
                    onClick={handleLogout}
                    isDisabled={isLoggingOut}
                  >
                    {ROUTE_NAME.LOGOUT}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 未ログインの場合
  return (
    <div className={styles.buttons}>
      <Link href={ROUTE.LOGIN}>
        <Button
          textColor="gold"
          backgroundColor="tertiary"
          isBorder={true}
          borderColor="gold"
          isRound={true}
          className={`${styles.button} ${styles.login}`}
        >
          {ROUTE_NAME.LOGIN}
        </Button>
      </Link>
      <Link href={ROUTE.SIGNUP}>
        <Button
          textColor="secondary"
          backgroundColor="accent"
          isBorder={true}
          borderColor="gold"
          isRound={true}
          className={`${styles.button} ${styles.signup}`}
        >
          {ROUTE_NAME.SIGNUP}
        </Button>
      </Link>
    </div>
  );
};
