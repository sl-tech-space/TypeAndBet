"use client";

import { useState, useCallback } from "react";

import { createGameSession, createBet } from "@/actions";
import {
  GAME_TIME_LIMIT,
  GAME_BET_LIMIT,
  GAME_MODE_ID,
  ERROR_MESSAGE,
} from "@/constants";
import { useTimer } from "@/features/games";
import { useAsyncState, useBaseRouter, useNavigator } from "@/hooks";

import type {
  UseBettingReturn,
  UseBettingProps,
  OnBetReturn,
} from "./betting.types";
import type { CreateBetResponse } from "@/types";

/**
 * ベッティング機能用のカスタムフック
 * ベット額の管理と制限時間の計算、残高チェックなどを行う
 * ※本番用ベット計算処理は、createBetアクションで行う
 */
const calculateBet = async (
  balance: number,
  amount: number
): Promise<CreateBetResponse["createBet"]["game"]> => {
  const { success, result, error } = await createBet(balance, amount);

  if (!success || !result) {
    throw new Error(error ?? ERROR_MESSAGE.CREATE_BET_FAILED);
  }

  return result.game;
};

export const useBetting = ({
  balance,
  onBet = async (amount: number): Promise<OnBetReturn> => {
    try {
      // ベット処理の実行
      const result = await calculateBet(balance, amount);

      return {
        success: true,
        result,
        error: null,
      };
    } catch (error) {
      // エラーオブジェクトの適切な処理
      const errorMessage =
        error instanceof Error ? error.message : "ベット処理に失敗しました";

      return {
        success: false,
        result: null,
        error: errorMessage,
      };
    }
  },
  minBet = GAME_BET_LIMIT.MIN_BET,
  maxBet = GAME_BET_LIMIT.MAX_BET,
  gameModeId,
}: UseBettingProps): UseBettingReturn => {
  const [betAmount, setBetAmount] = useState(minBet);
  const [displayBalance, setDisplayBalance] = useState(balance);
  const {
    error: asyncStateError,
    isSubmitting,
    withAsyncSubmit,
  } = useAsyncState();
  const { back } = useBaseRouter();
  const { toSimulateById, toPlayById } = useNavigator();
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
  const calculateTimeLimit = (amount: number): number => {
    return (
      GAME_TIME_LIMIT.MIN_TIME +
      Math.floor((maxBet - amount) * GAME_TIME_LIMIT.TIME_PER_BET)
    );
  };

  // 現在のベット額に基づく制限時間
  const timeLimit = calculateTimeLimit(betAmount);

  // ベット額が残高を超えているかどうか
  const isExceedingBalance = betAmount > balance;

  ///////////////////////
  // ナビゲーション関連 //
  //////////////////////

  // ベット額のバリデーション
  const validateBetAmount = (): void => {
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
  const executeBet = async (): Promise<void> => {
    // ベット額のバリデーション
    validateBetAmount();

    // 制限時間を設定
    startTimer(timeLimit);

    // シミュレートモードの場合はベット処理を実行せずタイピング画面に遷移
    if (gameModeId === GAME_MODE_ID.SIMULATE) {
      try {
        const session = await createGameSession(betAmount);
        // 残高を更新
        animateBalance(balance - betAmount);
        toSimulateById(session.id);
      } catch (error) {
        throw error;
      }
      return;
    }

    const { success, result, error } = await onBet(betAmount);

    if (!success || !result) {
      stopTimer();
      throw new Error(error ?? "ベットに失敗しました");
    }

    // 残高を更新
    animateBalance(balance - betAmount);

    toPlayById(result.id);
  };

  // 前のページに戻る
  const handleCancel = (): void => {
    stopTimer();
    back();
  };

  // ベット処理を実行（エラー処理とサブミット状態管理付き）
  const handleBet = withAsyncSubmit(executeBet);

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
