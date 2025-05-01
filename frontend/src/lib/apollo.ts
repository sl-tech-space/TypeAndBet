import { ApolloClient, InMemoryCache } from "@apollo/client";
import { GraphQLClient } from "@/graphql";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8000/graphql";

const client = new ApolloClient({
  uri: GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});

GraphQLClient.initialize(client);

export { client };
