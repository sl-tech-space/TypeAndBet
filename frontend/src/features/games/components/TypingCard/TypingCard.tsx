import { SentenceDisplay } from "./SentenceDisplay";
import { InputKeyboard } from "./InputKeyboard";
import styles from "./TypingCard.module.scss";
import { Card } from "@/components/ui";

/**
 * サーバコンポーネント
 * タイピングカード
 * タイピングゲームのカードコンポーネント
 * @returns タイピングゲームのカードコンポーネント
 */
export const TypingCard = () => {
  return (
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
      size="large"
      className={styles.card}
    >
      <div className={styles.card__container}>
        <div className={styles.card__container__sentence}>
          <SentenceDisplay />
        </div>
        <div className={styles.card__container__keyboard}>
          <InputKeyboard />
        </div>
      </div>
    </Card>
  );
};

export default TypingCard;
