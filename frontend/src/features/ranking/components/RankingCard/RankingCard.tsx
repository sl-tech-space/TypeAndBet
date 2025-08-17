import { type ReactElement } from "react";

import { Card, Text } from "@/components/ui";
import { RANKING_TITLE } from "@/constants";

import { RankingList } from "../RankingList";

import styles from "./RankingCard.module.scss";

/**
 * ランキングカード
 * @returns ランキングカード
 */
export const RankingCard = (): ReactElement => {
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
            size="xlarge"
            color="gold"
            className={styles.card__title}
          >
            {RANKING_TITLE}
          </Text>
          <div className={styles.card__content}>
            <RankingList />
          </div>
        </div>
      </Card>
    </div>
  );
};
