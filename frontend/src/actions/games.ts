"use server";

import { ApolloError } from "@apollo/client";

import { ERROR_MESSAGE } from "@/constants";
import { GamesService, GraphQLServerClient } from "@/graphql";
import { getAuthorizedServerClient } from "@/lib/apollo-server";

import type { CompleteSimulateResponse, GenerateTextResponse } from "@/types";

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
    const rawClient = await getAuthorizedServerClient();

    const { data }: { data: GenerateTextResponse } =
      await GamesService.generateText(new GraphQLServerClient(rawClient));

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

export async function completeSimulate(
  accuracy: number,
  correctTyped: number
): Promise<{
  success: boolean;
  score: number;
  goldChange: number;
  error: string | null;
}> {
  try {
    const rawClient = await getAuthorizedServerClient();

    const { data }: { data: CompleteSimulateResponse } =
      await GamesService.completeSimulate(
        new GraphQLServerClient(rawClient),
        accuracy,
        correctTyped
      );

    if (!data.completePractice.success) {
      return {
        success: false,
        score: 0,
        goldChange: 0,
        error: ERROR_MESSAGE.COMPLETE_SIMULATE_FAILED,
      };
    }

    return {
      success: true,
      score: data.completePractice.score,
      goldChange: data.completePractice.goldChange,
      error: null,
    };
  } catch (error: unknown) {
    console.error(ERROR_MESSAGE.COMPLETE_SIMULATE_FAILED, error);

    let errorMessage = ERROR_MESSAGE.UNEXPECTED;
    if (error instanceof ApolloError) {
      errorMessage = `${ERROR_MESSAGE.GRAPHQL_ERROR}: ${error.message}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      score: 0,
      goldChange: 0,
      error: errorMessage,
    };
  }
}
