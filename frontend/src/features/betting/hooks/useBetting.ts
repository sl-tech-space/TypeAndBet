"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GAME_TIME_LIMIT, GAME_BET_LIMIT } from "@/constants";
import { UseBettingReturn, UseBettingProps } from "./betting.types";

/**
 * ベッティング機能用のカスタムフック
 * ベット額の管理と制限時間の計算、残高チェックなどを行う
 */
export const useBetting = ({
  balance,
  onBet,
  minBet = GAME_BET_LIMIT.MIN_BET,
  maxBet = GAME_BET_LIMIT.MAX_BET,
}: UseBettingProps): UseBettingReturn => {
  const [betAmount, setBetAmount] = useState(GAME_BET_LIMIT.DEFAULT_BET);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  ////////////////////////
  // ベット関連          //
  ////////////////////////

  // ベット額に応じて制限時間を計算
  const _calculateTimeLimit = (amount: number) => {
    return (
      GAME_TIME_LIMIT.MIN_TIME +
      Math.floor(
        (GAME_BET_LIMIT.MAX_BET - amount) * GAME_TIME_LIMIT.TIME_PER_BET
      )
    );
  };

  // 現在のベット額に基づく制限時間
  const timeLimit = _calculateTimeLimit(betAmount);

  // ベット額が残高を超えているかどうか
  const isExceedingBalance = betAmount > balance;

  ////////////////////////
  // ナビゲーション関連 　//
  ////////////////////////

  // 前のページに戻る
  const handleCancel = () => {
    router.back();
  };

  // ベット処理を実行
  const handleBet = async () => {
    try {
      setIsSubmitting(true);
      await onBet(betAmount);
      // ベット処理が成功したら自動的に次のページに遷移する処理はサーバーアクション側で実装
    } catch (error) {
      console.error("ベット処理中にエラーが発生しました", error);
      // エラー処理はサーバーアクション側で行うのでここでは何もしない
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    betAmount,
    setBetAmount,
    timeLimit,
    isSubmitting,
    isExceedingBalance,
    handleBet,
    handleCancel,
  };
};
