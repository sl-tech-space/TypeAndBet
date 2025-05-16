"use client";

import styles from "./DetailCard.module.scss";
import { Card, Text } from "@/components/ui";
import { useTypingContext } from "@/features/games/contexts/TypingContext";

export const DetailCard = () => {
  const { accuracy, correctTypeCount } = useTypingContext();

  return (
    <div className={styles.wrapper}>
      <Card
        variant="default"
        backgroundColor="tertiary"
        isBorder={true}
        borderColor="tertiary"
        isRound={false}
        isHoverable={false}
        hasShadow={true}
        shadowColor="gold"
        padding="small"
        size="small"
        className={styles.detailCard}
      >
        <div className={styles.detailCard__container}>
          <Text variant="p" size="large" color="gold">
            正タイプ数: {correctTypeCount}
          </Text>
          <Text variant="p" size="large" color="gold">
            正タイプ率: {accuracy}%
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default DetailCard;
