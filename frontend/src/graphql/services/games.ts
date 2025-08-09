import {
  GraphQLServerClient,
  GENERATE_TEXT,
  COMPLETE_SIMULATE,
  COMPLETE_PLAY,
  GET_GAME_RESULT,
} from "@/graphql";

import type {
  GenerateTextResponse,
  CompleteSimulateResponse,
  CompletePlayResponse,
  GetGameResultResponse,
} from "@/types";

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

  /**
   * プレイゲームの完了
   * @param client グラフQLサーバークライアント
   * @param gameId ゲームID
   * @param accuracy 正確率
   * @param correctTyped 正しくタイプした数
   * @returns プレイゲームの完了レスポンス
   */
  public static async completePlay(
    client: GraphQLServerClient,
    gameId: string,
    accuracy: number,
    correctTyped: number
  ): Promise<{ data: CompletePlayResponse }> {
    const variables = {
      gameId,
      accuracy,
      correctTyped,
    };

    return client.executeMutation<CompletePlayResponse, typeof variables>(
      COMPLETE_PLAY,
      variables
    );
  }

  /**
   * ゲーム結果を取得
   * @param client グラフQLサーバークライアント
   * @param gameId ゲームID
   * @returns ゲーム結果レスポンス
   */
  public static async getGameResult(
    client: GraphQLServerClient,
    gameId: string
  ): Promise<{ data: GetGameResultResponse }> {
    const variables = {
      gameId,
    };

    return client.executeQuery<GetGameResultResponse, typeof variables>(
      GET_GAME_RESULT,
      variables
    );
  }
}
