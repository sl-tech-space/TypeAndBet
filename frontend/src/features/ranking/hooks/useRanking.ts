"use client";

import { useEffect, useState } from "react";

import { getRankings } from "@/actions/ranking";

import { useAsyncState } from "@/hooks";
import type { Ranking } from "@/types";

/**
 * ランキングを取得するフック
 * @returns ランキング
 */
export const useRanking = () => {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const { error, isLoading, withAsyncLoading } = useAsyncState();

  /**
   * ランキングを取得する関数
   */
  const fetchRankings = withAsyncLoading(async () => {
    const rankingsData = await getRankings();
    setRankings(rankingsData);
    return rankingsData;
  });

  useEffect(() => {
    fetchRankings();
  }, []);

  return {
    rankings,
    loading: isLoading,
    error,
    refetch: fetchRankings,
  };
};
