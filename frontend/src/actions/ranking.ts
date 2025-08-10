"use server";

import { getAuthorizedServerClient } from "@/lib/apollo-server";

import { GraphQLServerClient, RankingService } from "@/graphql";
import { Ranking } from "@/types";

/**
 * サーバーサイドでランキングを取得
 * @returns ランキング
 */
export async function getRankings(): Promise<Ranking[]> {
  const rawClient = await getAuthorizedServerClient();
  const client = new GraphQLServerClient(rawClient);

  const limit = 10;
  const offset = 0;

  const { data } = await RankingService.getRankings(client, limit, offset);

  const rankings: Ranking[] = data.rankings;
  if (!rankings || rankings.length === 0) {
    throw new Error("ランキングの取得に失敗しました");
  }

  return rankings;
}
