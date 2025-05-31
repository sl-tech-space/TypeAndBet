import { GraphQLClient as ApolloGraphQLClient } from "graphql-request";
import { GraphQLServerClient } from "@/graphql";

// Docker環境では、サービス名とポート8000を使用して接続
const GRAPHQL_ENDPOINT =
  process.env.GRAPHQL_ENDPOINT || "http://backend:8000/graphql/";

// サーバーサイド専用のGraphQLClientインスタンスを作成
const serverClient = new ApolloGraphQLClient(GRAPHQL_ENDPOINT, {
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  credentials: "include",
});

GraphQLServerClient.initialize(serverClient);
export { serverClient };

