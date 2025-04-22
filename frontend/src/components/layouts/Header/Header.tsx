"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.scss";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { SITE_NAME, ROUTE, ROUTE_NAME } from "@/constants";

/**
 * ヘッダーコンポーネント
 * @returns ヘッダーコンポーネント
 */
export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <Image
              src="/assets/images/logo.png"
              alt={SITE_NAME}
              width={70}
              height={70}
              priority
            />
          </Link>
          <Text variant="h1" className={styles.logo__text}>
            {SITE_NAME}
          </Text>
        </div>

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
      </div>
    </header>
  );
};

export default Header;
