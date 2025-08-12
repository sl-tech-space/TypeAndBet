"use server";

import { cookies } from "next/headers";

import {
  GAME_RESULT_COOKIE_NAME,
  NODE_ENV,
  SESSION_EXPIRY_TIME_MS,
} from "@/constants";

import type { GameResult } from "@/features/result/types";

/**
 * ゲーム結果をサーバーサイドのクッキーに保存
 */
export async function setGameResult(result: GameResult): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.set(GAME_RESULT_COOKIE_NAME, JSON.stringify(result), {
      httpOnly: true,
      secure: process.env.NODE_ENV === NODE_ENV.PRODUCTION,
      sameSite: "strict",
      maxAge: SESSION_EXPIRY_TIME_MS, // 5分間だけ有効
    });
  } catch (error) {
    console.error("ゲーム結果の保存に失敗:", error);
    throw new Error("ゲーム結果の保存に失敗しました");
  }
}

/**
 * ゲーム結果を取得してクッキーを削除
 */
export async function getAndDeleteGameResult(): Promise<GameResult | null> {
  try {
    const cookieStore = await cookies();
    const resultCookie = cookieStore.get(GAME_RESULT_COOKIE_NAME);

    if (!resultCookie) {
      return null;
    }

    // クッキーを削除
    cookieStore.delete(GAME_RESULT_COOKIE_NAME);

    return JSON.parse(resultCookie.value);
  } catch (error) {
    console.error("ゲーム結果の取得に失敗:", error);
    return null;
  }
}
