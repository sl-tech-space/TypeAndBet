"use client";

import { ReactNode } from "react";
import Image from "next/image";
import styles from "./ModeSelector.module.scss";
import { Button, Text } from "@/components/ui";
import { useGameMode } from "@/features/games";
import { useMessage } from "@/components/common";
import { GAME_MODE_MESSAGES, GAME_MODES } from "@/constants";

/**
 * クライアントコンポーネント
 * ゲームモードを選択するコンポーネント
 * @returns ゲームモードを選択するコンポーネント
 */
export const ModeSelector = (): ReactNode => {
  const { navigateToGameMode } = useGameMode();
  const { setMessage: setMessage } = useMessage();

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
            onClick={() => navigateToGameMode(GAME_MODES.SIMULATE)}
          >
            <Image
              src="/assets/svg/keyboard.svg"
              alt="キーボード"
              width={24}
              height={24}
            />
            {GAME_MODES.SIMULATE}
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
            onClick={() => navigateToGameMode(GAME_MODES.PLAY)}
          >
            <Image
              src="/assets/svg/paid.svg"
              alt="ゴールド"
              width={24}
              height={24}
            />
            {GAME_MODES.PLAY}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;
