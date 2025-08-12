import { GET_USER_GOLD } from "../queries/user";
import { GraphQLServerClient } from "../utils";

import type { GetGoldResponse } from "@/types/user";

/**
 * ユーザーサービスクラス
 */
export class UserService {
  /**
   * ユーザーの所持ゴールドを取得
   * @param client グラフQLサーバークライアント
   * @param id ユーザーID
   * @returns ユーザーの所持ゴールド
   */
  public static async getGold(
    client: GraphQLServerClient,
    id: string
  ): Promise<{ data: GetGoldResponse }> {
    return client.executeQuery<GetGoldResponse, { id: string }>(GET_USER_GOLD, {
      id: id,
    });
  }
}
