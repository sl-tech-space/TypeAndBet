/**
 * ユーザー情報
 */
export type User = {
  id: string;
  name: string | null;
  email: string | null;
  icon: string | null;
  gold: number;
  createdAt: string;
  updatedAt: string;
};

/**
 * セッションゴールド取得レスポンス
 */
export interface GetGoldResponse extends Record<string, unknown> {
  user: {
    gold: number;
  };
}
