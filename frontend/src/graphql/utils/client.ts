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
   * @template TData - クエリの戻り値の型
   * @template TVariables - クエリの変数の型
   */
  public async executeQuery<
    TData extends Record<string, unknown>,
    TVariables extends OperationVariables = OperationVariables
  >(
    query: DocumentNode,
    variables?: TVariables
  ): Promise<TData> {
    try {
      const { data } = await this.client.query<TData, TVariables>({
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
   * @template TData - ミューテーションの戻り値の型
   * @template TVariables - ミューテーションの変数の型
   */
  public async executeMutation<
    TData extends Record<string, unknown>,
    TVariables extends OperationVariables = OperationVariables
  >(
    mutation: DocumentNode,
    variables?: TVariables
  ): Promise<TData> {
    try {
      const { data } = await this.client.mutate<TData, TVariables>({
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
