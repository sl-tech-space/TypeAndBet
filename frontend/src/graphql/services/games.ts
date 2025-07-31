import { GraphQLServerClient, GENERATE_TEXT } from "@/graphql";

import type { GenerateTextResponse } from "@/types";

/**
 * ゲームサービスクラス
 */
export class GamesService {
  private static get graphqlClient(): GraphQLServerClient {
    return GraphQLServerClient.getInstance();
  }

  /**
   * テキストを生成する
   * @returns テキスト
   */
  public static async generateText(): Promise<{ data: GenerateTextResponse }> {
    return this.graphqlClient.executeMutation<GenerateTextResponse>(
      GENERATE_TEXT
    );
  }
}
