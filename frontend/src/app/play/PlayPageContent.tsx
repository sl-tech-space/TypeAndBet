"use client";

import { useSession } from "next-auth/react";
import { useEffect, type ReactElement } from "react";

import { Loading } from "@/components/ui";
import { GAME_MODE_ID } from "@/constants";
import { GoldBetCard } from "@/features/betting";
import { useNavigator } from "@/hooks";

import styles from "./PlayPageContent.module.scss";

/**
 * PlayPageの実際のコンテンツ部分
 * 認証状態に応じてGoldBetCardまたはリダイレクトを実行
 * @returns プレイページコンテンツ
 */
export const PlayPageContent = (): ReactElement => {
  const { data: session, status } = useSession();
  const { toError, toLogin } = useNavigator();

  // 認証状態によるナビゲーション処理
  useEffect(() => {
    if (status === "loading") return; // ローディング中は何もしない

    // 認証されていない場合はログインページへ
    if (status === "unauthenticated" || !session?.user) {
      toLogin();
      return;
    }

    // セッションにgoldがない場合は404エラーへ
    if (!session.user.gold && session.user.gold !== 0) {
      toError.to404();
      return;
    }
  }, [status, session, toLogin, toError]);

  // ローディング中の表示
  if (status === "loading") {
    return (
      <div className={styles.container}>
        <Loading />
      </div>
    );
  }

  // 認証されていない場合（リダイレクト前の一時的な表示）
  if (status === "unauthenticated" || !session?.user) {
    return (
      <div className={styles.container}>
        <Loading />
      </div>
    );
  }

  // ゴールド情報がない場合（エラー状態）
  if (!session.user.gold && session.user.gold !== 0) {
    return (
      <div className={styles.container}>
        <Loading />
      </div>
    );
  }

  // 正常な状態でGoldBetCardを表示
  return (
    <GoldBetCard gameModeId={GAME_MODE_ID.PLAY} balance={session.user.gold} />
  );
};

export default PlayPageContent;
