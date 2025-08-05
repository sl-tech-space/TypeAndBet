import { GraphQLClient } from "graphql-request";

import type { TypedDocumentNode } from "@graphql-typed-document-node/core";

interface GraphQLErrorResponse {
  response?: {
    errors?: Array<{
      message?: string;
      extensions?: {
        details?: string[];
      };
    }>;
  };
  message: string;
}

export class GraphQLServerClient {
  // private static instance: GraphQLServerClient;
  // private client: GraphQLClient;

  // private constructor(client: GraphQLClient) {
  //   this.client = client;
  // }

  // public static initialize(client: GraphQLClient): void {
  //   this.instance = new GraphQLServerClient(client);
  // }

  // public static getInstance(): GraphQLServerClient {
  //   if (!this.instance) {
  //     throw new Error("GraphQLServerClientが初期化されていません");
  //   }
  //   return this.instance;
  // }
  constructor(private readonly client: GraphQLClient) {}

  /**
   * GraphQLエラーを処理する
   * @param error エラーオブジェクト
   */
  private handleError(error: unknown): never {
    const graphQLError = error as GraphQLErrorResponse;

    try {
      // エラーオブジェクトからレスポンスを取得
      const errorData = graphQLError.response?.errors?.[0];

      if (errorData) {
        // detailsが存在する場合はそれを使用
        const details = errorData.extensions?.details;
        if (details && details.length > 0) {
          throw new Error(details.join("\n"));
        }

        // detailsがない場合はmessageを使用
        if (errorData.message) {
          throw new Error(errorData.message);
        }
      }

      // エラーメッセージが直接含まれている場合
      const messageMatch = graphQLError.message.match(/認証に失敗しました: (.*)/);
      if (messageMatch) {
        try {
          const parsedError = JSON.parse(messageMatch[1]) as GraphQLErrorResponse;
          const firstError = parsedError.response?.errors?.[0];
          const details = firstError?.extensions?.details;
          if (details) {
            throw new Error(details.join("\n"));
          }
        } catch {
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
   * クエリを実行する
   * @param query クエリ
   * @param variables 変数
   * @returns レスポンス
   */
  public async executeQuery<TData extends Record<string, unknown>, TVariables extends Record<string, unknown> = Record<string, never>>(
    query: TypedDocumentNode<TData, TVariables> | string,
    variables?: TVariables
  ): Promise<{ data: TData }> {
    try {
      const result = await this.client.request<TData>(query, variables);
      return { data: result };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * ミューテーションを実行する
   * @param mutation ミューテーション
   * @param variables 変数
   * @returns レスポンス
   */
  public async executeMutation<TData extends Record<string, unknown>, TVariables extends Record<string, unknown> = Record<string, never>>(
    mutation: TypedDocumentNode<TData, TVariables> | string,
    variables?: TVariables
  ): Promise<{ data: TData }> {
    try {
      const result = await this.client.request<TData>(mutation, variables);
      return { data: result };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
