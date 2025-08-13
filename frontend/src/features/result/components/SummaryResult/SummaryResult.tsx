"use client";

import { type ReactElement, useEffect } from "react";

import { Text } from "@/components/ui";
import type { GameResult } from "@/features/result/types";
import { useCountUp } from "@/hooks";
import { isValidMinusValue } from "@/utils";

import styles from "./SummaryResult.module.scss";

/**
 * サマリー結果コンポーネント
 * @param result - ゲーム結果
 * @returns サマリー結果コンポーネント
 */
export const SummaryResult = ({
  result,
}: {
  result: GameResult;
}): ReactElement => {
  const before = result.beforeBetGold ?? 0;
  const minusBet = result.betGold ?? 0;
  const plusScore = result.scoreGoldChange ?? 0;
  const total = result.resultGold ?? before - minusBet + plusScore;
  const Gold = ({
    value,
  }: {
    value: number | null | undefined;
  }): ReactElement => {
    const num = value ?? 0;
    const str = num.toLocaleString();
    const signPrefix = isValidMinusValue(num.toString()) ? "" : "";
    return (
      <span className={styles["summary-result__gold"]}>
        {signPrefix}
        {str}
        <span className={styles["summary-result__unit"]}> G</span>
      </span>
    );
  };

  // カウントアップ（ランキング → 次ランク → スコア → GOLD式1/2/3/合計 の順に実行）
  const rankAnim = useCountUp(0, {
    durationMs: 500,
    easing: "easeOutCubic",
    startOnMount: false,
  });
  const nextAnim = useCountUp(0, {
    durationMs: 500,
    easing: "easeOutCubic",
    startOnMount: false,
  });
  const scoreAnim = useCountUp(0, {
    durationMs: 500,
    easing: "easeOutCubic",
    startOnMount: false,
  });
  const beforeAnim = useCountUp(0, {
    durationMs: 350,
    easing: "easeOutCubic",
    startOnMount: false,
  });
  const betAnim = useCountUp(0, {
    durationMs: 350,
    easing: "easeOutCubic",
    startOnMount: false,
  });
  const plusAnim = useCountUp(0, {
    durationMs: 350,
    easing: "easeOutCubic",
    startOnMount: false,
  });
  const totalAnim = useCountUp(0, {
    durationMs: 600,
    easing: "easeOutCubic",
    startOnMount: false,
  });

  useEffect(() => {
    // 既存アニメをリセット（途中開始対策で 0 に戻す）
    rankAnim.set(0);
    nextAnim.set(0);
    scoreAnim.set(0);
    beforeAnim.set(0);
    betAnim.set(0);
    plusAnim.set(0);
    totalAnim.set(0);

    rankAnim.start(result.currentRank ?? 0, () => {
      nextAnim.start(result.nextRankGold ?? 0, () => {
        scoreAnim.start(result.score ?? 0, () => {
          beforeAnim.start(before, () => {
            betAnim.start(minusBet, () => {
              plusAnim.start(plusScore, () => {
                totalAnim.start(total);
              });
            });
          });
        });
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    before,
    minusBet,
    plusScore,
    total,
    result.currentRank,
    result.nextRankGold,
    result.score,
  ]);

  return (
    <div className={styles["summary-result"]}>
      <div className={styles["summary-result__grid"]}>
        <div className={styles["summary-result__left"]}>
          <div className={styles["summary-result__rank"]}>
            <Text
              variant="p"
              size="large"
              color="gold"
              className={styles["summary-result__rank_label"]}
            >
              ランキング
            </Text>
            <Text
              variant="h3"
              size="xlarge"
              color="gold"
              className={styles["summary-result__rank_value"]}
            >
              {rankAnim.value.toLocaleString()}
            </Text>
          </div>

          <div className={styles["summary-result__next"]}>
            <Text
              variant="p"
              size="large"
              color="gold"
              className={styles["summary-result__next_text"]}
            >
              次のランキングまで: <Gold value={nextAnim.value} />
            </Text>
          </div>

          <div className={styles["summary-result__score"]}>
            <Text
              variant="p"
              size="large"
              color="gold"
              className={styles["summary-result__score_text"]}
            >
              スコア: {scoreAnim.value.toLocaleString()}
            </Text>
          </div>
        </div>

        <div className={styles["summary-result__right"]}>
          <Text
            variant="h3"
            size="xxlarge"
            color="gold"
            className={styles["summary-result__title"]}
          >
            GOLD
          </Text>
          <div className={styles["summary-result__formula"]}>
            <Text
              variant="p"
              size="xlarge"
              color="gold"
              className={styles["summary-result__formula_line"]}
            >
              <Gold value={beforeAnim.value} />
              <span className={styles["summary-result__op"]}>−</span>
              <Gold value={Math.abs(betAnim.value)} />
              <span className={styles["summary-result__op"]}>
                {isValidMinusValue(plusAnim.value.toString()) ? "−" : "＋"}
              </span>
              <Gold value={Math.abs(plusAnim.value)} />
              <span className={styles["summary-result__op"]}>＝</span>
            </Text>
            <Text
              variant="h2"
              size="xxlarge"
              color="gold"
              className={styles["summary-result__total"]}
            >
              <Gold value={totalAnim.value} />
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryResult;
