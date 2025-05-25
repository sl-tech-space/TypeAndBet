"use server";

import { ApolloError } from "@apollo/client";
import { GamesService } from "@/graphql";
import "@/lib/apollo-server";

/**
 * テキスト生成
 * @returns テキスト
 */
export async function generateText() {
  try {
    const { data } = await GamesService.generateText();
    return { success: true, result: data.generateText };
  } catch (error) {
    console.error("テキスト生成中にエラーが発生:", error);

    let errorMessage = "予期せぬエラーが発生しました";
    if (error instanceof ApolloError) {
      errorMessage = `GraphQLエラー: ${error.message}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
