import {
  GraphQLServerClient,
  GENERATE_TEXT,
  COMPLETE_SIMULATE,
} from "@/graphql";

import type { GenerateTextResponse, CompleteSimulateResponse } from "@/types";

/**
 * ゲームサービスクラス
 */
export class GamesService {
  /**
   * テキストを生成する
   * @returns テキスト
   */
  public static async generateText(
    client: GraphQLServerClient
  ): Promise<{ data: GenerateTextResponse }> {
    return client.executeMutation<GenerateTextResponse>(GENERATE_TEXT);
  }

  /**
   * シミュレーション完了処理
   * @param client グラフQLサーバークライアント
   * @param accuracy 正確率
   * @param correctTyped 正しくタイプした数
   * @returns シミュレーション完了処理レスポンス
   */
  public static async completeSimulate(
    client: GraphQLServerClient,
    accuracy: number,
    correctTyped: number
  ): Promise<{ data: CompleteSimulateResponse }> {
    const variables = {
      accuracy,
      correctTyped,
    };

    return client.executeMutation<CompleteSimulateResponse, typeof variables>(
      COMPLETE_SIMULATE,
      variables
    );
  }
}
