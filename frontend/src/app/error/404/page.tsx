"use client";

import Link from "next/link";
import { type ReactElement } from "react";

import { HOME_BACK_BUTTON, ROUTE } from "@/constants";
import { useBaseRouter } from "@/hooks/routing/useBaseRouter";
import { useNavigator } from "@/hooks/routing/useNavigator";

import styles from "../error.module.scss";

/**
 * 404ページコンポーネント
 * @returns 404ページコンポーネント
 */
export default function NotFoundPage(): ReactElement {
  const { toHome } = useNavigator();
  const { back } = useBaseRouter();

  const handleGoBack = (): void => {
    if (window.history.length > 1) {
      back();
    } else {
      toHome();
    }
  };

  return (
    <div className={styles.error}>
      <div className={styles.error__container}>
        <div className={styles.error__code}>404</div>
        <h1 className={styles.error__title}>ページが見つかりません</h1>
        <p className={styles.error__description}>
          お探しのページは移動または削除された可能性があります。
          <br />
          URLをご確認いただくか、下記のボタンからホームページにお戻りください。
        </p>

        <div className={styles.error__actions}>
          <Link
            href={ROUTE.HOME}
            className={`${styles.error__button} ${styles["error__button--primary"]}`}
          >
            <svg
              className={styles.error__icon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {HOME_BACK_BUTTON.TEXT}
          </Link>

          <button
            onClick={handleGoBack}
            className={`${styles.error__button} ${styles["error__button--secondary"]}`}
            type="button"
          >
            <svg
              className={styles.error__icon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            前のページに戻る
          </button>
        </div>

        <div className={styles.error__details}>
          <h3 className={styles["error__details-title"]}>
            このエラーが発生する原因
          </h3>
          <ul className={styles["error__details-list"]}>
            <li>URLが間違って入力されている</li>
            <li>リンクが古い、または無効になっている</li>
            <li>ページが移動または削除されている</li>
            <li>一時的なサーバーの問題</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
