import { BET, GraphQLServerClient } from "@/graphql";
import type { CreateBetResponse } from "@/types";

/**
 * ベットサービスクラス
 */
export class BettingService {
  /**
   * ベットを作成する
   * @param amount ベット額
   * @returns ベット作成レスポンス
   */
  public static async createBet(
    client: GraphQLServerClient,
    amount: number
  ): Promise<{ data: CreateBetResponse }> {
    const variables = {
      betGold: amount,
    };

    return client.executeMutation<CreateBetResponse, typeof variables>(
      BET,
      variables
    );
  }
}
