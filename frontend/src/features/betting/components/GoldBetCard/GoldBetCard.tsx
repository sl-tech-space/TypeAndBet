"use client";

import { type ReactElement } from "react";

import { Card, Overlay, Text } from "@/components/ui";

import styles from "./GoldBetCard.module.scss";
import { GoldBetForm } from "./GoldBetForm";

import type { GoldBetCardProps } from "./GoldBetCard.types";

/**
 * サーバコンポーネント
 * ゴールドをベットするためのカードコンポーネント
 * クライアントコンポーネントのGoldBetFormをラップ
 * @param balance ユーザーの残高
 * @param onBet ベット実行関数（サーバーアクション）
 * @param isLoading ローディング状態
 * @param minBet 最小ベット額
 * @param maxBet 最大ベット額
 * @param gameModeId ゲームモード識別子
 * @returns ベット設定カードコンポーネント
 */
export const GoldBetCard = ({
  balance,
  onBet,
  isLoading = false,
  minBet = 100,
  maxBet = 700,
  gameModeId,
}: GoldBetCardProps): ReactElement => {
  // フォームに渡すプロパティをまとめる
  const formProps = {
    balance,
    onBet,
    isLoading,
    minBet,
    maxBet,
    gameModeId,
  };

  return (
    <Overlay isVisible={true}>
      <div className={styles["gold-bet-card__container"]}>
        <Card
          variant="bordered"
          backgroundColor="tertiary"
          isBorder={true}
          borderColor="gold"
          isRound={true}
          hasShadow={true}
          shadowColor="gold"
          padding="large"
          className={styles["gold-bet-card__card"]}
        >
          <Text variant="h2" className={styles["gold-bet-card__title"]}>
            ベット額を選択
          </Text>

          <GoldBetForm {...formProps} />
        </Card>
      </div>
    </Overlay>
  );
};
