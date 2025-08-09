import { GraphQLClient } from "graphql-request";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";

const GRAPHQL_ENDPOINT =
  process.env.GRAPHQL_ENDPOINT || "http://backend:8000/graphql/";

export async function getAuthorizedServerClient(): Promise<GraphQLClient> {
  const cookieStore = await cookies();
  const token = await getToken({
    req: { headers: { cookie: cookieStore.toString() } },
    secret: process.env.NEXTAUTH_SECRET,
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    Cookie: cookieStore.toString(),
  };

  // トークンがセッションのルートレベルに設定されているため、直接アクセス
  const accessToken = token?.accessToken;
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return new GraphQLClient(GRAPHQL_ENDPOINT, {
    headers,
    credentials: "include",
  });
}
