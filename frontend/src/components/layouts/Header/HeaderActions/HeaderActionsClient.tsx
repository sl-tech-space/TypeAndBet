"use client";

import Link from "next/link";
import styles from "./HeaderActions.module.scss";
import { Button, Text, Icon } from "@/components/ui";
import { ROUTE, ROUTE_NAME } from "@/constants";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { maskEmail } from "@/utils";

/**
 * クライアントコンポーネント
 * ヘッダーのアクションコンポーネント
 * インタラクティブな部分を担当するため、クライアントコンポーネントとして実装
 * @returns ヘッダーアクションコンポーネント
 */
export const HeaderActionsClient = () => {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const isLoggedIn = status === "authenticated" && session?.accessToken;

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: false
      });
      router.push(ROUTE.HOME);
    } catch (error) {
      // エラー処理
    }
  };

  // ログイン済みの場合
  if (isLoggedIn && session.user) {
    return (
      <div className={styles.user}>
        <div className={styles["user__info"]}>
          <div className={styles["user__text"]}>
            <Text color="gold">{session.user.name || "ゲスト"}</Text>
            <Text color="gold">{(session.user.gold || 0).toLocaleString()}G</Text>
          </div>
          <div className={styles["user__icon-container"]}>
            <div
              className={styles["user__icon"]}
              onClick={() => setIsOpen(!isOpen)}
            >
              <Icon
                icon={session.user.icon || "/assets/images/default-icon.png"}
                alt={
                  session.user.name ? `${session.user.name}のアイコン` : "デフォルトアイコン"
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
                  <Text color="gold">
                    {session.user.email ? maskEmail(session.user.email) : "メールアドレスなし"}
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
                  >
                    ログアウト
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
