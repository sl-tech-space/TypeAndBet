"use client";

import { type ReactElement } from "react";

import { Icon, Loading, Text } from "@/components/ui";

import { useEmailVerify } from "../../hooks";

import styles from "./EmailVerify.module.scss";

/**
 * メール認証コンポーネント
 * URLトークンを自動取得して認証処理を実行
 * 成功時は認証成功表示後にリダイレクト、失敗時は500ページにリダイレクト
 */
export const EmailVerify = (): ReactElement => {
  const { verifyState, message, error, isLoading, countdown } =
    useEmailVerify();

  return (
    <div className={styles["email-verify"]}>
      <div className={styles["email-verify__container"]}>
        {/* アイコン表示 */}
        <div className={styles["email-verify__icon"]}>
          {verifyState === "verifying" && <Loading />}
          {verifyState === "success" && (
            <Icon
              icon="/assets/svg/mail.svg"
              alt="認証成功アイコン"
              size="xl"
            />
          )}
          {verifyState === "error" && (
            <div className={styles["email-verify__error-icon"]}>⚠️</div>
          )}
        </div>

        {/* タイトル */}
        <Text
          variant="h2"
          size="xlarge"
          color={
            verifyState === "success"
              ? "gold"
              : verifyState === "error"
                ? "secondary"
                : "secondary"
          }
          className={styles["email-verify__title"]}
        >
          {verifyState === "verifying" && "メール認証中..."}
          {verifyState === "success" && "メール認証完了"}
          {verifyState === "error" && "認証エラー"}
        </Text>

        {/* メッセージ */}
        {(message || error) && (
          <Text
            variant="p"
            size="medium"
            color={verifyState === "success" ? "gold" : "secondary"}
            className={styles["email-verify__message"]}
          >
            {message || error}
          </Text>
        )}

        {/* カウントダウン表示 */}
        {countdown !== null && countdown > 0 && (
          <div className={styles["email-verify__countdown"]}>
            <Text variant="h3" size="large" color="gold">
              {countdown}
            </Text>
          </div>
        )}

        {/* 状態に応じた説明 */}
        <Text
          variant="p"
          size="small"
          color="secondary"
          className={styles["email-verify__description"]}
        >
          {verifyState === "verifying" &&
            "認証処理を実行しています。しばらくお待ちください..."}
          {verifyState === "success" &&
            countdown !== null &&
            (countdown > 0
              ? "ログインページに移動します"
              : "ログインページに移動中...")}
          {verifyState === "error" &&
            countdown !== null &&
            (countdown > 0
              ? "エラーページに移動します"
              : "エラーページに移動中...")}
        </Text>

        {/* プログレスバー風の表示 */}
        {isLoading && (
          <div className={styles["email-verify__progress"]}>
            <div className={styles["email-verify__progress-bar"]} />
          </div>
        )}
      </div>
    </div>
  );
};
