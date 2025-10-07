"use server";

import { ApolloError } from "@apollo/client";
import { encode, getToken } from "next-auth/jwt";
import { cookies } from "next/headers";

import { ERROR_MESSAGE, NODE_ENV } from "@/constants";
import { BettingService, GraphQLServerClient } from "@/graphql";
import { getAuthorizedServerClient } from "@/lib/apollo-server";
import type { CreateBetResponse } from "@/types";

export async function createBet(
  balance: number,
  amount: number
): Promise<{
  success: boolean;
  result: CreateBetResponse["createBet"] | null;
  error: string | null;
}> {
  try {
    // 認証チェック
    const cookieStore = await cookies();

    // NextAuth v5のCookie名を環境に応じて設定
    const cookieName =
      process.env.NODE_ENV === NODE_ENV.PRODUCTION
        ? "__Secure-authjs.session-token"
        : "authjs.session-token";

    const currentToken = await getToken({
      req: { headers: { cookie: cookieStore.toString() } },
      secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
      cookieName, // 明示的にCookie名を指定
    });

    if (!currentToken) {
      throw new Error("認証されていません");
    }

    const rawClient = await getAuthorizedServerClient();

    const { data }: { data: CreateBetResponse } =
      await BettingService.createBet(
        new GraphQLServerClient(rawClient),
        amount
      );

    if (!data.createBet) {
      return {
        success: false,
        result: null,
        error: ERROR_MESSAGE.CREATE_BET_FAILED,
      };
    }

    // セッションの残高を更新
    const newGold = balance - amount >= 0 ? balance - amount : 0;

    // gold 値を更新
    const updatedToken = {
      ...currentToken,
      gold: newGold,
    };

    // JWT 再発行
    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET!;
    const encoded = await encode({
      token: updatedToken,
      secret,
      salt: secret,
    });

    // Cookie名は既に上で定義済み（環境に応じて設定）
    cookieStore.set(cookieName, encoded, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === NODE_ENV.PRODUCTION,
      sameSite: "lax",
    });

    return {
      success: true,
      result: data.createBet,
      error: null,
    };
  } catch (error: unknown) {
    console.error(ERROR_MESSAGE.CREATE_BET_FAILED, error);

    let errorMessage = ERROR_MESSAGE.UNEXPECTED;
    if (error instanceof ApolloError) {
      errorMessage = `${ERROR_MESSAGE.GRAPHQL_ERROR}: ${error.message}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      result: null,
      error: errorMessage,
    };
  }
}
