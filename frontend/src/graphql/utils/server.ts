import { GraphQLClient as ApolloGraphQLClient } from "graphql-request";
import { DocumentNode } from "graphql";

export class GraphQLServerClient {
  private static instance: GraphQLServerClient;
  private client: ApolloGraphQLClient;

  private constructor(client: ApolloGraphQLClient) {
    this.client = client;
  }

  public static initialize(client: ApolloGraphQLClient): GraphQLServerClient {
    if (!GraphQLServerClient.instance) {
      GraphQLServerClient.instance = new GraphQLServerClient(client);
    }
    return GraphQLServerClient.instance;
  }

  public static getInstance(): GraphQLServerClient {
    if (!GraphQLServerClient.instance) {
      throw new Error("GraphQLServerClientが初期化されていません");
    }
    return GraphQLServerClient.instance;
  }

  public async executeQuery<T = any, V extends object = any>(
    query: DocumentNode | string,
    variables?: V
  ): Promise<T> {
    try {
      return await this.client.request<T>(query, variables);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async executeMutation<T = any, V extends object = any>(
    mutation: DocumentNode | string,
    variables?: V
  ): Promise<T> {
    try {
      return await this.client.request<T>(mutation, variables);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): never {
    if (error instanceof Error) {
      throw new Error(`GraphQLエラー: ${error.message}`);
    }
    throw new Error("GraphQLでの予期しないエラーが発生しました");
  }
}
