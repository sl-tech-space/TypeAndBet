"use client";

import { type ReactElement } from "react";

import { Icon, Loading, Text } from "@/components/ui";

import { useRanking } from "@/features/ranking";
import styles from "./RankingList.module.scss";

import type { Ranking } from "@/types";

/**
 * ランキングリストアイテム
 */
const RankingItem = ({ ranking }: { ranking: Ranking }): ReactElement => {
  return (
    <div className={styles.item}>
      <div className={styles.item__rank}>
        <Text
          variant="p"
          size="medium"
          color={ranking.ranking <= 3 ? "gold" : "primary"}
          className={styles.item__rank_text}
        >
          {ranking.ranking}
        </Text>
      </div>
      <div className={styles.item__user}>
        <Icon
          icon={ranking.icon}
          alt={`${ranking.name}のアイコン`}
          className={styles.item__icon}
          size="md"
          isBorder={false}
          isRound={true}
          hasHoverEffect
        />
        <Text
          variant="p"
          size="medium"
          color="gold"
          className={styles.item__name}
        >
          {ranking.name}
        </Text>
      </div>
      <div className={styles.item__gold}>
        <Text
          variant="p"
          size="medium"
          color="gold"
          className={styles.item__gold_text}
        >
          {ranking.gold.toLocaleString()}G
        </Text>
      </div>
    </div>
  );
};

/**
 * ランキングリスト
 * @returns ランキングリスト
 */
export const RankingList = (): ReactElement => {
  const { rankings, loading, error } = useRanking();

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <Text variant="p" size="medium" color="primary">
          ランキングの取得に失敗しました
        </Text>
        <Text variant="p" size="small" color="secondary">
          {error.message}
        </Text>
      </div>
    );
  }

  if (rankings.length === 0) {
    return (
      <div className={styles.empty}>
        <Text variant="p" size="medium" color="secondary">
          ランキングデータがありません
        </Text>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      <div className={styles.list__header}>
        <Text variant="p" size="small" color="secondary">
          順位
        </Text>
        <Text variant="p" size="small" color="secondary">
          プレイヤー
        </Text>
        <Text variant="p" size="small" color="secondary">
          ゴールド
        </Text>
      </div>
      <div className={styles.list__items}>
        {rankings.map((ranking: Ranking, index: number) => (
          <RankingItem key={`${ranking.ranking}-${index}`} ranking={ranking} />
        ))}
      </div>
    </div>
  );
};
