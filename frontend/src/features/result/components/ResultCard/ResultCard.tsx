import { usePathname } from "next/navigation";
import { type ReactElement } from "react";

import { Card, Text } from "@/components/ui";
import { RESULT_CONTENTS, RESULT_TITLE, ROUTE } from "@/constants";
import { useResultStore } from "@/features/result/stores";

import styles from "./ResultCard.module.scss";

export const ResultCard = (): ReactElement => {
  const pathName = usePathname();

  const result = useResultStore((state) => state.result);

  /**
   * 結果の内容を表示する
   * @param content 結果の内容
   * @param value 結果の値
   * @param change 結果の変化量
   * @returns 結果の内容を表示する
   */
  const contentView = (
    content: string,
    value: number | "-",
    unit: string,
    change?: number
  ): ReactElement => {
    return (
      <div className={styles.card__container__content}>
        <Text variant="p" size="large" color="gold">
          {content} : {value} {unit}
        </Text>
        <Text variant="p" size="large" color="gold">
          {change ? `${change}` : ""}
        </Text>
      </div>
    );
  };

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
        className={styles.card}
      >
        <div className={styles.card__container}>
          <Text variant="h3" size="large" color="gold">
            {RESULT_TITLE}
          </Text>
          {pathName === ROUTE.PLAY && (
            <>
              {contentView(RESULT_CONTENTS.SCORE, result?.score || 0, "点")}
              {contentView(RESULT_CONTENTS.GOLD, 100, "G", 10)}
              {contentView(RESULT_CONTENTS.RANKING, 100, "位", 10)}
              {contentView(RESULT_CONTENTS.NEXT_RANKING, 100, "G", 10)}
            </>
          )}
          {pathName === ROUTE.SIMULATE && (
            <>
              {contentView(RESULT_CONTENTS.SCORE, result?.score || 0, "点")}
              {contentView(RESULT_CONTENTS.GOLD, "-", "G", result?.goldChange)}
              {contentView(RESULT_CONTENTS.RANKING, "-", "位")}
              {contentView(RESULT_CONTENTS.NEXT_RANKING, "-", "G")}
            </>
          )}
        </div>
      </Card>
    </div>
  );
};
