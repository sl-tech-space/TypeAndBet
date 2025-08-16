"use client";

import { useCallback, useEffect, useState } from "react";

import { getRankings } from "@/actions/ranking";
import { useAsyncState, type ErrorState } from "@/hooks";
import type { Ranking } from "@/types";

/**
 * ランキングを取得するフック
 * @returns ランキング
 */
export const useRanking = (): {
  rankings: Ranking[];
  loading: boolean;
  error: ErrorState | null;
  refetch: () => Promise<Ranking[]>;
} => {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const { error, isLoading, withAsyncLoading } = useAsyncState();

  /**
   * サーバーアクションのエラーを処理するカスタムエラーハンドラー
   */
  const handleRankingError = useCallback((error: unknown) => {
    // ランキングをクリア
    setRankings([]);
  }, []);

  /**
   * ランキングを取得する関数
   */
  const fetchRankings = useCallback(async () => {
    return withAsyncLoading(async () => {
      const rankingsData = await getRankings();
      setRankings(rankingsData);
      return rankingsData;
    }, handleRankingError)();
  }, [withAsyncLoading, handleRankingError]);

  useEffect(() => {
    fetchRankings().catch(() => {
      // useEffect内でのエラーは既にfetchRankings内で処理されている
      // ここでは何もしない
    });
  }, [fetchRankings]);

  return {
    rankings,
    loading: isLoading,
    error,
    refetch: fetchRankings,
  };
};
