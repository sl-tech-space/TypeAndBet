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
 * セッションゴールド同期更新レスポンス
 */
export interface SessionGoldUpdateResponse extends Record<string, unknown> {
  sessionGoldUpdate: {
    success: boolean;
    error: string | null;
  };
}
