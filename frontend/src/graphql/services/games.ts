import { GraphQLServerClient, GENERATE_TEXT } from "@/graphql";

/**
 * ゲームサービスクラス
 */
export class GamesService {
  private static get graphqlClient() {
    return GraphQLServerClient.getInstance();
  }
  
  /**
   * テキストを生成する
   * @returns テキスト
   */
  public static async generateText() {
    return this.graphqlClient.executeMutation(GENERATE_TEXT);
  }
}

