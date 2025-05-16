"use client";

import { signInWithGoogle } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button/Button";
import Image from "next/image";
import styles from "./GoogleAuth.module.scss";

/**
 * クライアントコンポーネント
 * Google認証用のボタンコンポーネント
 * @returns Google認証用のボタンコンポーネン用用
 */
export const GoogleAuth = () => {
  return (
    <Button
      type="button"
      textColor="secondary"
      backgroundColor="tertiary"
      borderColor="gold"
      buttonSize="large"
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

export default GoogleAuth;
