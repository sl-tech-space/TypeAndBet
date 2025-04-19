"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.scss";
import { Button } from "@/components/ui/Button";

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
              src="/vercel.svg"
              alt="Type＆Bet"
              width={120}
              height={40}
              priority
            />
          </Link>
        </div>

        <div className={styles.buttons}>
          <Link href="/signup">
            <Button className={`${styles.button} ${styles.signupButton}`}>
              新規登録
            </Button>
          </Link>
          <Link href="/login">
            <Button className={`${styles.button} ${styles.loginButton}`}>
              ログイン
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
