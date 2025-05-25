import { GraphQLClient } from "graphql-request";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";

export class GraphQLServerClient {
  private static instance: GraphQLServerClient;
  private client: GraphQLClient;

  private constructor(client: GraphQLClient) {
    this.client = client;
  }

  public static initialize(client: GraphQLClient) {
    this.instance = new GraphQLServerClient(client);
  }

  public static getInstance(): GraphQLServerClient {
    if (!this.instance) {
      throw new Error("GraphQLServerClientが初期化されていません");
    }
    return this.instance;
  }

  /**
   * GraphQLエラーを処理する
   * @param error エラーオブジェクト
   */
  private handleError(error: any): never {
    try {
      // エラーオブジェクトからレスポンスを取得
      const errorData = error.response?.errors?.[0];

      if (errorData) {
        // detailsが存在する場合はそれを使用
        if (errorData.extensions?.details?.length > 0) {
          throw new Error(errorData.extensions.details.join("\n"));
        }

        // detailsがない場合はmessageを使用
        if (errorData.message) {
          throw new Error(errorData.message);
        }
      }

      // エラーメッセージが直接含まれている場合
      const messageMatch = error.message.match(/認証に失敗しました: (.*)/);
      if (messageMatch) {
        try {
          const parsedError = JSON.parse(messageMatch[1]);
          const firstError = parsedError.response?.errors?.[0];
          if (firstError?.extensions?.details) {
            throw new Error(firstError.extensions.details.join("\n"));
          }
        } catch (parseError) {
          // パース失敗時は元のメッセージを使用
          throw new Error(messageMatch[1]);
        }
      }
    } catch (parseError) {
      if (parseError instanceof Error) {
        throw parseError;
      }
    }

    // デフォルトのエラーメッセージ
    throw new Error("予期せぬエラーが発生しました。");
  }

  /**
   * ミューテーションを実行する
   * @param mutation ミューテーション
   * @param variables 変数
   * @returns レスポンス
   */
  public async executeMutation<T = any>(
    mutation: TypedDocumentNode<T, any> | string,
    variables?: any
  ): Promise<{ data: T }> {
    try {
      const result = await this.client.request<T>(mutation, variables);
      return { data: result };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
