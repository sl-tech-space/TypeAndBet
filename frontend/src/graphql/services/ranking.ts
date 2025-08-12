import { GET_RANKINGS, GraphQLServerClient } from "@/graphql";

import type { GetRankingsResponse } from "@/types";

/**
 * ランキングサービスクラス
 */
export class RankingService {
  /**
   * ランキングを取得
   * @param client グラフQLサーバークライアント
   * @param limit 取得件数
   * @param offset 取得オフセット
   * @returns ランキング
   */
  public static async getRankings(
    client: GraphQLServerClient,
    limit: number,
    offset: number
  ): Promise<{ data: GetRankingsResponse }> {
    return client.executeQuery<
      GetRankingsResponse,
      { limit: number; offset: number }
    >(GET_RANKINGS, { limit, offset });
  }
}
