"use server";

import { ApolloError } from "@apollo/client";
import { cookies } from "next/headers";
import { getToken, encode } from "next-auth/jwt";

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
    const currentToken = await getToken({
      req: { headers: { cookie: cookieStore.toString() } },
      secret: process.env.NEXTAUTH_SECRET,
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
    const encoded = await encode({
      token: updatedToken,
      secret: process.env.NEXTAUTH_SECRET!,
      salt: process.env.NEXTAUTH_SECRET!,
    });

    const cookieName = "next-auth.session-token";
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
