"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GAME_TIME_LIMIT, GAME_BET_LIMIT, GAME_MODE_ID } from "@/constants";
import { useAsyncState } from "@/hooks";
import { UseBettingReturn, UseBettingProps } from "./betting.types";

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
  const [betAmount, setBetAmount] = useState(GAME_BET_LIMIT.DEFAULT_BET);
  const { error, isSubmitting, withAsyncSubmit } = useAsyncState();
  const router = useRouter();

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

    // シミュレートモードの場合はベット処理を実行せずタイピング画面に遷移
    if (gameModeId === GAME_MODE_ID.SIMULATE) {
      router.push(`/simulate/${betAmount}`);
      return;
    }

    const result = await onBet(betAmount);

    if (!result.success) {
      throw new Error(result.error || "ベットに失敗しました");
    }
  };

  // 前のページに戻る
  const handleCancel = () => {
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
    error: error?.message ?? null,
    handleBet,
    handleCancel,
  };
};
