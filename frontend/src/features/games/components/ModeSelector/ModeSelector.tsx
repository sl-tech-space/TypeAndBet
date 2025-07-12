"use client";

import { ReactNode } from "react";
import Image from "next/image";
import styles from "./ModeSelector.module.scss";
import { Button, Text } from "@/components/ui";
import { useMessage } from "@/components/common";
import { GAME_MODE_MESSAGES, GAME_MODE } from "@/constants";
import { useNavigator, useSession } from "@/hooks";

/**
 * クライアントコンポーネント
 * ゲームモードを選択するコンポーネント
 * @returns ゲームモードを選択するコンポーネント
 */
export const ModeSelector = (): ReactNode => {
  const { isAuthenticated, accessToken } = useSession();
  const { setMessage } = useMessage();
  const { toSimulate, toPlay } = useNavigator();

  const isLoggedIn = isAuthenticated && accessToken;

  return (
    <div className={styles["select-mode"]}>
      <Text variant="p" className={styles["select-mode__title"]}>
        Choose Your Game Mode
      </Text>
      <div className={styles["select-mode__buttons"]}>
        <div
          className={styles["select-mode__button-container"]}
          onMouseEnter={() => setMessage(GAME_MODE_MESSAGES.GUEST.SIMULATE)}
          onMouseLeave={() => setMessage(null)}
        >
          <Button
            textColor="secondary"
            backgroundColor="accent"
            isBorder={true}
            borderColor="gold"
            buttonSize="large"
            onClick={() => toSimulate()}
          >
            <Image
              src="/assets/svg/keyboard.svg"
              alt="キーボード"
              width={24}
              height={24}
            />
            {GAME_MODE.SIMULATE}
          </Button>
        </div>

        <div
          className={styles["select-mode__button-container"]}
          onMouseEnter={() => setMessage(GAME_MODE_MESSAGES.GUEST.PLAY)}
          onMouseLeave={() => setMessage(null)}
        >
          <Button
            textColor="secondary"
            backgroundColor="accent"
            isBorder={true}
            borderColor="gold"
            buttonSize="large"
            onClick={() => toPlay()}
            isDisabled={!isLoggedIn}
          >
            <Image
              src="/assets/svg/paid.svg"
              alt="ゴールド"
              width={24}
              height={24}
            />
            {GAME_MODE.PLAY}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;
