import { type ReactElement } from "react";

import { Card } from "@/components/ui";

import { Timer } from "./Timer";
import styles from "./TimerCard.module.scss";

/**
 * サーバコンポーネント
 * タイマーを表示するカードコンポーネント
 * @returns タイマーカード
 */
export const TimerCard = (): ReactElement => {
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
        className={styles.timerCard}
      >
        <div className={styles.timerCard__container}>
          <Timer />
        </div>
      </Card>
    </div>
  );
};
