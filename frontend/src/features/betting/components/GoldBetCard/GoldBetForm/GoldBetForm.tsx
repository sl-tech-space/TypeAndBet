"use client";

import Image from "next/image";
import { SessionProvider } from "next-auth/react";
import { type ReactElement } from "react";

import { Button } from "@/components/ui";
import { GAME_BET_LIMIT } from "@/constants";
import { useBetting } from "@/features/betting/hooks";

import styles from "./GoldBetForm.module.scss";

import type { GoldBetFormProps } from "./GoldBetForm.types";

/**
 * ゴールドベットフォーム（クライアントコンポーネント）
 * インタラクティブな要素を含むためクライアントコンポーネントとして実装
 * @param balance ユーザーの残高
 * @param onBet ベット実行関数
 * @param isLoading ローディング状態
 * @param minBet 最小ベット額
 * @param maxBet 最大ベット額
 * @returns ベットフォームコンポーネント
 */
export const GoldBetForm = ({
  balance,
  onBet,
  isLoading = false,
  minBet = GAME_BET_LIMIT.MIN_BET,
  maxBet = GAME_BET_LIMIT.MAX_BET,
  gameModeId,
}: GoldBetFormProps): ReactElement => {
  const {
    betAmount,
    setBetAmount,
    timeLimit,
    isSubmitting,
    isExceedingBalance,
    error,
    handleBet,
    handleCancel,
    displayBalance,
  } = useBetting({
    balance,
    onBet,
    minBet,
    maxBet,
    gameModeId,
  });

  return (
    <SessionProvider>
      <div className={styles["form-content"]}>
        <div className={styles["form-content__info-box"]}>
          <div className={styles["form-content__info-row"]}>
            <span className={styles["form-content__info-label"]}>
              制限時間:
            </span>
            <span className={styles["form-content__info-value"]}>
              {timeLimit} 秒
            </span>
          </div>
          <div className={styles["form-content__info-row"]}>
            <span className={styles["form-content__info-label"]}>
              所持ゴールド:
            </span>
            <span className={styles["form-content__info-value"]}>
              {displayBalance}
            </span>
          </div>
        </div>

        <div className={styles["form-content__amount-selector"]}>
          <label className={styles["form-content__label"]}>
            ベット額: {betAmount} ゴールド
          </label>
          <div className={styles["form-content__slider-container"]}>
            <input
              type="range"
              min={minBet}
              max={maxBet}
              step="5"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className={styles["form-content__slider"]}
              disabled={isLoading || isSubmitting}
            />
            <div
              className={`${styles["form-content__slider-mark"]} ${styles["form-content__slider-mark--left"]}`}
            ></div>
            <div
              className={`${styles["form-content__slider-mark"]} ${styles["form-content__slider-mark--right"]}`}
            ></div>
          </div>
          <div className={styles["form-content__range"]}>
            <span>{minBet}</span>
            <span>{maxBet}</span>
          </div>
        </div>

        {isExceedingBalance && (
          <div className={styles["form-content__error"]}>
            ベット額が所持ゴールドを超えています
          </div>
        )}

        {error && <div className={styles["form-content__error"]}>{error}</div>}

        <div className={styles["form-content__actions"]}>
          <Button
            textColor="gold"
            backgroundColor="tertiary"
            isBorder={true}
            borderColor="gold"
            buttonSize="medium"
            onClick={handleCancel}
            isDisabled={isLoading || isSubmitting}
          >
            キャンセル
          </Button>
          <Button
            textColor="secondary"
            backgroundColor="accent"
            isBorder={true}
            borderColor="gold"
            buttonSize="medium"
            onClick={handleBet}
            isDisabled={isLoading || isSubmitting || isExceedingBalance}
            isLoading={isSubmitting}
          >
            <Image
              src="/assets/svg/paid.svg"
              alt="ゴールド"
              width={24}
              height={24}
            />
            ベット
          </Button>
        </div>
      </div>
    </SessionProvider>
  );
};
