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
   * ランキングを取得する関数
   */
  const fetchRankings = useCallback(async () => {
    return withAsyncLoading(async () => {
      const rankingsData = await getRankings();
      setRankings(rankingsData);
      console.log(rankingsData);
      return rankingsData;
    })();
  }, [withAsyncLoading]);

  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  return {
    rankings,
    loading: isLoading,
    error,
    refetch: fetchRankings,
  };
};
