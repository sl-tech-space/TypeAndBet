import { type ReactElement } from "react";

import { Card, Text } from "@/components/ui";

import styles from "./IntroCard.module.scss";

export const IntroCard = (): ReactElement => {
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
            Type&Betの遊び方
          </Text>

          <div className={styles.card__content}>
            <p className={styles.lead}>
              タイピング×ベットの対戦ゲーム。実力でゴールドを増やそう！
            </p>
            <ul className={styles.list}>
              <li>シミュレートで操作や難易度を確認</li>
              <li>ログインして実際にゴールドを賭けてプレイ</li>
              <li>正確さとスピードでスコアが決まり、ゴールドが増減</li>
              <li>所持ゴールドを増やしてトップを目指そう！</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
