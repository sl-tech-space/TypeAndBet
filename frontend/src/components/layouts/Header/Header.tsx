"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.scss";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

/**
 * ヘッダーコンポーネント
 * @param props プロパティ
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
              alt="Type＆Bet"
              width={70}
              height={70}
              priority
            />
          </Link>
          <Text variant="h1" className={styles.logoText}>
            Type＆Bet
          </Text>
        </div>

        <div className={styles.buttons}>
          <Link href="/login">
            <Button
              textColor="gold"
              backgroundColor="tertiary"
              borderColor="gold"
              isRound={true}
              className={`${styles.button} ${styles.loginButton}`}
            >
              ログイン
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              textColor="secondary"
              backgroundColor="accent"
              borderColor="gold"
              isRound={true}
              className={`${styles.button} ${styles.signupButton}`}
            >
              新規登録
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
