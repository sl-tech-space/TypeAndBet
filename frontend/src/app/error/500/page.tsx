"use client";

import Link from "next/link";
import { type ReactElement } from "react";

import { HOME_BACK_BUTTON, ROUTE } from "@/constants";

import { useBaseRouter } from "@/hooks/routing/useBaseRouter";
import { useNavigator } from "@/hooks/routing/useNavigator";

import styles from "../error.module.scss";

/**
 * 500ページコンポーネント
 * @returns 500ページコンポーネント
 */
export default function ServerErrorPage(): ReactElement {
  const { toHome } = useNavigator();
  const { back } = useBaseRouter();

  const handleReload = (): void => {
    window.location.reload();
  };

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
        <div className={styles.error__code}>500</div>
        <h1 className={styles.error__title}>サーバーエラーが発生しました</h1>
        <p className={styles.error__description}>
          申し訳ございません。サーバーで予期しないエラーが発生しました。
          <br />
          しばらく時間をおいてから再度お試しいただくか、ホームページにお戻りください。
        </p>

        <div className={styles.error__actions}>
          <button
            onClick={handleReload}
            className={`${styles.error__button} ${styles["error__button--primary"]}`}
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            ページを再読み込み
          </button>

          <Link
            href={ROUTE.HOME}
            className={`${styles.error__button} ${styles["error__button--secondary"]}`}
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
            サーバーエラーの一般的な原因
          </h3>
          <ul className={styles["error__details-list"]}>
            <li>サーバーの一時的な過負荷</li>
            <li>メンテナンス作業の実施中</li>
            <li>データベース接続の問題</li>
            <li>システムの設定エラー</li>
          </ul>
        </div>

        <div className={styles.error__details}>
          <h3 className={styles["error__details-title"]}>
            問題が解決しない場合
          </h3>
          <ul className={styles["error__details-list"]}>
            <li>
              お問い合わせ窓口（
              <a
                href="mailto:admin@san-tou.com"
                style={{
                  color: "var(--color-primary)",
                  textDecoration: "underline",
                }}
              >
                admin@san-tou.com
              </a>
              ）までご連絡ください
            </li>
            <li>エラーの発生時刻と行っていた操作をお知らせください</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
