import { GraphQLClient } from "graphql-request";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";

import { NODE_ENV } from "@/constants";

const GRAPHQL_ENDPOINT =
  process.env.GRAPHQL_ENDPOINT || "http://backend:8000/graphql/";

export async function getAuthorizedServerClient(): Promise<GraphQLClient> {
  const cookieStore = await cookies();

  // NextAuth v5のCookie名を環境に応じて設定
  const cookieName =
    process.env.NODE_ENV === NODE_ENV.PRODUCTION
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";

  const token = await getToken({
    req: { headers: { cookie: cookieStore.toString() } },
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    cookieName, // 明示的にCookie名を指定
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    Host:
      process.env.NODE_ENV === NODE_ENV.PRODUCTION ? "frontend" : "localhost", // 明示的にHostヘッダーを設定
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
