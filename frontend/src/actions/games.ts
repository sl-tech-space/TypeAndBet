"use server";

import { ApolloError } from "@apollo/client";

import { ERROR_MESSAGE } from "@/constants";
import { GamesService } from "@/graphql";

import "@/lib/apollo-server";
import type { GenerateTextResponse } from "@/types";

/**
 * テキスト生成
 * @returns テキスト
 */
export async function generateText(): Promise<{
  success: boolean;
  result: GenerateTextResponse["generateText"] | null;
  error: string | null;
}> {
  try {
    const { data }: { data: GenerateTextResponse } =
      await GamesService.generateText();

    if (!data.generateText) {
      return {
        success: false,
        result: null,
        error: ERROR_MESSAGE.GENERATE_TEXT_FAILED,
      };
    }

    return {
      success: true,
      result: {
        pairs: data.generateText.pairs,
        theme: data.generateText.theme,
        category: data.generateText.category,
      },
      error: null,
    };
  } catch (error: unknown) {
    console.error(ERROR_MESSAGE.GENERATE_TEXT_FAILED, error);

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
