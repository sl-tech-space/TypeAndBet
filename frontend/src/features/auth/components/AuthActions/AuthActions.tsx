"use client";

import styles from "./AuthActions.module.scss";
import Link from "next/link";
import { GoogleAuth } from "../oauth";
import { AUTH_ACTIONS, ROUTE } from "@/constants";
import { useAuthPath } from "@/features/auth";

/**
 * クライアントコンポーネント
 * 認証アクションコンポーネント
 * 各認証フォームの下部に表示される
 * @returns 認証アクションコンポーネント
 */
export const AuthActions = () => {
  const { isLoginScreen } = useAuthPath();

  return (
    <div className={styles["auth-actions"]}>
      <div className={styles["auth-actions__divider"]}>{AUTH_ACTIONS.OR}</div>
      <GoogleAuth />
      <Link
        href={isLoginScreen ? ROUTE.PASSWORD_FORGET : ROUTE.SIGNUP}
        className={styles["auth-actions__password-forget"]}
      >
        {isLoginScreen
          ? AUTH_ACTIONS.PASSWORD_FORGET
          : AUTH_ACTIONS.ALREADY_HAVE_ACCOUNT}
      </Link>
    </div>
  );
};

export default AuthActions;
