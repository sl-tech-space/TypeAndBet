"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";
import styles from "./HeaderActions.module.scss";
import { Button, Text, Icon } from "@/components/ui";
import { ROUTE, ROUTE_NAME } from "@/constants";
import { maskEmail } from "@/utils";
import { useBaseRouter, useNavigator, useSession } from "@/hooks";

/**
 * クライアントコンポーネント
 * ヘッダーのアクションコンポーネント
 * インタラクティブな部分を担当するため、クライアントコンポーネントとして実装
 * @returns ヘッダーアクションコンポーネント
 */
export const HeaderActionsClient = () => {
  const { user, isAuthenticated, accessToken } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { refresh } = useBaseRouter();
  const { toHome } = useNavigator();

  const isLoggedIn = isAuthenticated && accessToken && !isLoggingOut;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut({
        redirect: false,
      });
      toHome();
      refresh();
    } catch (error) {
      setIsLoggingOut(false);
      // エラー処理
    }
  };

  // ログイン済みの場合
  if (isLoggedIn && user) {
    return (
      <div className={styles.user}>
        <div className={styles["user__info"]}>
          <div className={styles["user__text"]}>
            <Text
              variant="h3"
              color="gold"
              className={styles["user__text__name"]}
            >
              {user.name || "ゲスト"}
            </Text>
            <Text
              variant="h3"
              color="gold"
              className={styles["user__text__gold"]}
            >
              {(user.gold || 0).toLocaleString()}G
            </Text>
          </div>
          <div className={styles["user__icon-container"]}>
            <div
              className={styles["user__icon"]}
              onClick={() => setIsOpen(!isOpen)}
            >
              <Icon
                icon={user.icon || "/assets/images/default-icon.png"}
                alt={
                  user.name ? `${user.name}のアイコン` : "デフォルトアイコン"
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
                    {user.email ? maskEmail(user.email) : "メールアドレスなし"}
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
