import styles from "./TimerCard.module.scss";
import { Card } from "@/components/ui";
import { Timer } from "./Timer";

/**
 * サーバコンポーネント
 * タイマーを表示するカードコンポーネント
 * @returns タイマーカード
 */
export const TimerCard = () => {
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

export default TimerCard;
