import {
  ApolloClient,
  NormalizedCacheObject,
  OperationVariables,
  DocumentNode,
  ApolloError,
} from "@apollo/client";

/**
 * GraphQLクライアントのシングルトンクラス
 */
export class GraphQLClient {
  private static instance: GraphQLClient;
  private client: ApolloClient<NormalizedCacheObject>;

  private constructor(client: ApolloClient<NormalizedCacheObject>) {
    this.client = client;
  }

  /**
   * クライアントの初期化
   */
  public static initialize(
    client: ApolloClient<NormalizedCacheObject>
  ): GraphQLClient {
    if (!GraphQLClient.instance) {
      GraphQLClient.instance = new GraphQLClient(client);
    }
    return GraphQLClient.instance;
  }

  /**
   * インスタンスの取得
   */
  public static getInstance(): GraphQLClient {
    if (!GraphQLClient.instance) {
      throw new Error("GraphQLClientが初期化されていません");
    }
    return GraphQLClient.instance;
  }

  /**
   * クエリの実行
   */
  public async executeQuery<T = any, V extends OperationVariables = any>(
    query: DocumentNode,
    variables?: V
  ): Promise<T> {
    try {
      const { data } = await this.client.query<T, V>({
        query,
        variables,
      });
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * ミューテーションの実行
   */
  public async executeMutation<T = any, V extends OperationVariables = any>(
    mutation: DocumentNode,
    variables?: V
  ): Promise<T> {
    try {
      const { data } = await this.client.mutate<T, V>({
        mutation,
        variables,
      });

      if (!data) {
        throw new Error("ミューテーション実行後返却されたデータがありません");
      }

      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * エラーハンドリング
   */
  private handleError(error: unknown): never {
    if (error instanceof ApolloError) {
      throw new Error(`GraphQLエラー: ${error.message}`);
    }
    if (error instanceof Error) {
      throw new Error(`エラーが発生しました: ${error.message}`);
    }
    throw new Error("GraphQLでの予期しないエラーが発生しました");
  }
}
