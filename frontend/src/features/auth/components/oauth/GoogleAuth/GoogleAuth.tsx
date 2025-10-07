"use client";

import Image from "next/image";

import { type ReactElement } from "react";

import { Button } from "@/components/ui";
import { signInWithGoogle } from "@/lib/actions/auth";

import styles from "./GoogleAuth.module.scss";

/**
 * クライアントコンポーネント
 * Google認証用のボタンコンポーネント
 * @returns Google認証用のボタンコンポーネント
 */
export const GoogleAuth = (): ReactElement => {
  return (
    <Button
      type="button"
      textColor="secondary"
      backgroundColor="tertiary"
      borderColor="gold"
      isBorder={true}
      isRound={true}
      className={styles.googleAuth}
      onClick={() => signInWithGoogle()}
    >
      <Image
        src="/assets/svg/google.svg"
        alt="Google"
        width={18}
        height={18}
        className={styles.googleAuth__icon}
      />
      <span className={styles.googleAuth__text}>Googleで認証</span>
    </Button>
  );
};
