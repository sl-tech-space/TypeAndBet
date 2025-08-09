import clsx from "clsx";
import { type ReactElement } from "react";

import { Text } from "@/components/ui";
import { isValidMinusValue } from "@/utils";

import styles from "./ResultContent.module.scss";
import { type ResultContentProps } from "./ResultContent.types";

/**
 * タイピング結果のコンテンツ
 * @param content コンテンツのラベル
 * @param value コンテンツの値
 * @param unit コンテンツの単位
 * @param change コンテンツの変化量
 * @returns タイピング結果のコンテンツ
 */
export const ResultContent = ({
  content,
  value,
  unit,
  change,
  "data-index": dataIndex,
}: ResultContentProps): ReactElement => (
  <div className={styles.content} data-index={dataIndex}>
    <Text
      variant="p"
      size="large"
      color="gold"
      className={styles.content__label}
    >
      {content}：
    </Text>
    <div className={styles.content__value}>
      <Text
        variant="p"
        size="large"
        color="gold"
        className={styles.content__value_number}
      >
        {value}
      </Text>
      <Text
        variant="p"
        size="large"
        color="gold"
        className={styles.content__value_unit}
      >
        {unit}
      </Text>
    </div>
    <Text
      variant="p"
      size="large"
      className={clsx(styles.content__change, {
        [styles.content__change_minus]: isValidMinusValue(change.toString()),
        [styles.content__change_plus]:
          !isValidMinusValue(change.toString()) && change !== "",
      })}
    >
      {change !== ""
        ? isValidMinusValue(change.toString())
          ? change
          : `+${change}`
        : ""}
    </Text>
  </div>
);
