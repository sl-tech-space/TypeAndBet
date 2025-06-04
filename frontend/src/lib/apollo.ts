import { ApolloClient, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { GraphQLClient } from "@/graphql";

const GRAPHQL_ENDPOINT: string =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8000/graphql";

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  uri: GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});

GraphQLClient.initialize(client);

export { client };
