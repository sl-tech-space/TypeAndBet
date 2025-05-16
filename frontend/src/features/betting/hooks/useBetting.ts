"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { GAME_TIME_LIMIT, GAME_BET_LIMIT, GAME_MODE_ID } from "@/constants";
import { useAsyncState } from "@/hooks";
import { UseBettingReturn, UseBettingProps } from "./betting.types";
import { useTimer } from "@/features/games/hooks/useTimer";

/**
 * ベッティング機能用のカスタムフック
 * ベット額の管理と制限時間の計算、残高チェックなどを行う
 */
export const useBetting = ({
  balance,
  onBet = () => Promise.resolve({ success: true }),
  minBet = GAME_BET_LIMIT.MIN_BET,
  maxBet = GAME_BET_LIMIT.MAX_BET,
  gameModeId,
}: UseBettingProps): UseBettingReturn => {
  const [betAmount, setBetAmount] = useState(minBet);
  const [displayBalance, setDisplayBalance] = useState(balance);
  const { error: asyncStateError, isSubmitting, withAsyncSubmit } = useAsyncState();
  const router = useRouter();
  const { startTimer, stopTimer } = useTimer();

  // アニメーション付きで残高を更新する関数
  const animateBalance = useCallback(
    (targetBalance: number) => {
      const startBalance = displayBalance;
      const diff = targetBalance - startBalance;
      const duration = 300; // アニメーション時間（ミリ秒）
      const steps = 20; // アニメーションのステップ数
      const stepDuration = duration / steps;
      const stepValue = diff / steps;
      let step = 0;

      const interval = setInterval(() => {
        step++;
        if (step >= steps) {
          setDisplayBalance(targetBalance);
          clearInterval(interval);
        } else {
          setDisplayBalance(Math.round(startBalance + stepValue * step));
        }
      }, stepDuration);
    },
    [displayBalance]
  );

  ////////////////
  // ベット関連 //
  ///////////////

  // ベット額に応じて制限時間を計算
  const _calculateTimeLimit = (amount: number) => {
    return (
      GAME_TIME_LIMIT.MIN_TIME +
      Math.floor((maxBet - amount) * GAME_TIME_LIMIT.TIME_PER_BET)
    );
  };

  // 現在のベット額に基づく制限時間
  const timeLimit = _calculateTimeLimit(betAmount);

  // ベット額が残高を超えているかどうか
  const isExceedingBalance = betAmount > balance;

  ///////////////////////
  // ナビゲーション関連 //
  //////////////////////

  // ベット額のバリデーション
  const _validateBetAmount = () => {
    if (betAmount < minBet) {
      throw new Error("ベット額が最小ベット額を下回っています");
    }

    if (betAmount > maxBet) {
      throw new Error("ベット額が最大ベット額を超えています");
    }

    if (isExceedingBalance) {
      throw new Error("残高が不足しています");
    }
  };

  // ベット処理の実装
  const _executeBet = async () => {
    // ベット額のバリデーション
    _validateBetAmount();

    // 制限時間を設定
    startTimer(timeLimit);

    // シミュレートモードの場合はベット処理を実行せずタイピング画面に遷移
    if (gameModeId === GAME_MODE_ID.SIMULATE) {
      const id = Math.random().toString(36).substring(2, 10);
      // 残高を更新
      animateBalance(balance - betAmount);
      await Promise.resolve(router.push(`/simulate/${id}`));
      return;
    }

    const result = await onBet(betAmount);

    if (!result.success) {
      stopTimer();
      throw new Error("ベットに失敗しました");
    }
  };

  // 前のページに戻る
  const handleCancel = () => {
    stopTimer();
    router.back();
  };

  // ベット処理を実行（エラー処理とサブミット状態管理付き）
  const handleBet = withAsyncSubmit(_executeBet);

  return {
    betAmount,
    setBetAmount,
    timeLimit,
    isSubmitting,
    isExceedingBalance,
    error: asyncStateError?.message ?? null,
    handleBet,
    handleCancel,
    displayBalance,
  };
};
