/**
 * ランキング
 */
export type Ranking = {
  ranking: number;
  name: string;
  icon: string;
  gold: number;
};

/**
 * ランキングレスポンス
 */
export interface GetRankingsResponse extends Record<string, unknown> {
  rankings: Ranking[];
}
