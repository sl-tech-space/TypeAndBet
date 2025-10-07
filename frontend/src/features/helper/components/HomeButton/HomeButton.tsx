import Link from "next/link";

import { type ReactElement } from "react";

import { Button } from "@/components/ui";
import { HOME_BACK_BUTTON } from "@/constants";

import styles from "./HomeButton.module.scss";

/**
 * ホームに戻るボタンコンポーネント
 * @returns ホームに戻るボタンコンポーネント
 */
export const HomeButton = (): ReactElement => {
  return (
    <div className={styles.container}>
      <Link href={HOME_BACK_BUTTON.ROUTE}>
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
    </div>
  );
};

export default HomeButton;
