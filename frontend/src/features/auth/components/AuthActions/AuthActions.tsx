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
      <div className={styles["auth-actions__links"]}>
        {isLoginScreen ? (
          <>
            <Link
              href={ROUTE.PASSWORD_FORGET}
              className={styles["auth-actions__password-forget"]}
            >
              {AUTH_ACTIONS.PASSWORD_FORGET}
            </Link>
            <Link
              href={ROUTE.SIGNUP}
              className={styles["auth-actions__signup"]}
            >
              {AUTH_ACTIONS.NO_ACCOUNT}
            </Link>
          </>
        ) : (
          <Link href={ROUTE.LOGIN} className={styles["auth-actions__login"]}>
            {AUTH_ACTIONS.ALREADY_HAVE_ACCOUNT}
          </Link>
        )}
      </div>
    </div>
  );
};

export default AuthActions;
