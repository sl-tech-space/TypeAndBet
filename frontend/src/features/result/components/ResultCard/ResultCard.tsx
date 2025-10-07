"use client";

import Link from "next/link";

import { type ReactElement } from "react";

import { Button, Card, Loading, Text } from "@/components/ui";
import { HOME_BACK_BUTTON, RESULT_TITLE, RETRY, ROUTE } from "@/constants";
import { useResult } from "@/features/result/hooks";

import { SummaryResult } from "../SummaryResult";

import styles from "./ResultCard.module.scss";

/**
 * 結果カードコンポーネント
 * @returns 結果カードコンポーネント
 */
export const ResultCard = (): ReactElement => {
  const { result, isLoading, isSimulate, isPlay } = useResult();

  return (
    <div className={styles.wrapper}>
      <Card
        variant="default"
        backgroundColor="tertiary"
        isBorder={true}
        borderColor="gold"
        isRound={false}
        isHoverable={false}
        hasShadow={true}
        shadowColor="gold"
        padding="small"
        size="large"
        className={styles.card}
      >
        <div className={styles.card__container}>
          <Text
            variant="h3"
            size="xxlarge"
            color="gold"
            className={styles.card__title}
          >
            {RESULT_TITLE}
          </Text>
          {isLoading && (
            <div className={styles.card__loading}>
              <Loading />
            </div>
          )}
          {!isLoading && result === null && (
            <div className={styles.card__no_result}>
              <Text variant="p" size="xlarge" color="gold">
                タイピング結果がありません
              </Text>
            </div>
          )}
          {!isLoading && result !== null && (
            <div className={styles.card__content}>
              {isSimulate && (
                <Text
                  variant="p"
                  size="large"
                  className={styles.card__warning_text}
                >
                  シミュレートモードのため結果は反映されません
                </Text>
              )}
              <SummaryResult result={result} />
            </div>
          )}
          <div className={styles.card__result_form}>
            <Link href={ROUTE.HOME}>
              <Button
                textColor="gold"
                backgroundColor="tertiary"
                isBorder={true}
                borderColor="gold"
                isRound={true}
              >
                {HOME_BACK_BUTTON.TEXT}
              </Button>
            </Link>
            <Link href={isPlay ? ROUTE.PLAY : ROUTE.SIMULATE}>
              <Button
                textColor="gold"
                backgroundColor="tertiary"
                isBorder={true}
                borderColor="gold"
                isRound={true}
                className={styles.card__result_form__retry}
              >
                {RETRY}
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};
