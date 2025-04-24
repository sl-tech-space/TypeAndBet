"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import styles from "./HeaderActions.module.scss";
import { ROUTE, ROUTE_NAME } from "@/constants";

/**
 * クライアントコンポーネント
 * ヘッダーのアクションコンポーネント
 * インタラクティブな部分を担当するため、クライアントコンポーネントとして実装
 * @returns ヘッダーアクションコンポーネント
 */
export const HeaderActions = () => {
  return (
    <div className={styles.buttons}>
      <Link href={ROUTE.LOGIN}>
        <Button
          textColor="gold"
          backgroundColor="tertiary"
          isBorder={true}
          borderColor="gold"
          isRound={true}
          className={`${styles.button} ${styles.login}`}
        >
          {ROUTE_NAME.LOGIN}
        </Button>
      </Link>
      <Link href={ROUTE.SIGNUP}>
        <Button
          textColor="secondary"
          backgroundColor="accent"
          isBorder={true}
          borderColor="gold"
          isRound={true}
          className={`${styles.button} ${styles.signup}`}
        >
          {ROUTE_NAME.SIGNUP}
        </Button>
      </Link>
    </div>
  );
};

export default HeaderActions;
