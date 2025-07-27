"use server";

import { ApolloError } from "@apollo/client";

import { ERROR_MESSAGE } from "@/constants";
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
    console.error(ERROR_MESSAGE.GENERATE_TEXT_FAILED, error);

    let errorMessage = ERROR_MESSAGE.UNEXPECTED;
    if (error instanceof ApolloError) {
      errorMessage = `${ERROR_MESSAGE.GRAPHQL_ERROR}: ${error.message}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
