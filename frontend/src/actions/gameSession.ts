"use server";

import { cookies } from "next/headers";

import { nanoid } from "nanoid";

import {
  NODE_ENV,
  SESSION_EXPIRY_TIME_MS,
  GAME_SESSION_COOKIE_NAME,
  GAME_SESSION_NANOID_LENGTH,
} from "@/constants";
import type { GameSession } from "@/types/games";

/**
 * ゲームセッションが有効かどうかを検証する
 * @param sessionId 検証するセッションID
 * @returns セッションが有効な場合はtrue、無効な場合はfalse
 */
export async function isValidGameSession(sessionId: string): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(
      `${GAME_SESSION_COOKIE_NAME}-${sessionId}`
    );
    if (!sessionCookie) return false;

    const session = JSON.parse(sessionCookie.value) as GameSession;
    return Date.now() <= session.expiresAt;
  } catch {
    return false;
  }
}

/**
 * ゲームセッションを作成する
 * @param betAmount ベット金額
 * @returns 作成されたゲームセッション
 */
export async function createGameSession(
  betAmount: number
): Promise<GameSession> {
  const session: GameSession = {
    id: nanoid(GAME_SESSION_NANOID_LENGTH),
    betAmount,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_EXPIRY_TIME_MS,
  };

  // HTTPOnly Cookieとしてセッションを保存
  const cookieStore = await cookies();
  cookieStore.set({
    name: `${GAME_SESSION_COOKIE_NAME}-${session.id}`,
    value: JSON.stringify(session),
    httpOnly: true,
    secure: process.env.NODE_ENV === NODE_ENV.PRODUCTION,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_EXPIRY_TIME_MS / 1000,
  });

  return session;
}

/**
 * ゲームセッションを取得する
 * @param id ゲームセッションID
 * @returns 取得されたゲームセッション
 */
export async function getGameSession(id: string): Promise<GameSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(`${GAME_SESSION_COOKIE_NAME}-${id}`);
    if (!sessionCookie) return null;

    const session = JSON.parse(sessionCookie.value) as GameSession;
    if (Date.now() > session.expiresAt) {
      // 期限切れの場合はCookieを削除
      cookieStore.delete(`${GAME_SESSION_COOKIE_NAME}-${id}`);
      return null;
    }

    return session;
  } catch (error: unknown) {
    console.error(error);
    // JSONパースエラーの場合はCookieを削除
    const cookieStore = await cookies();
    cookieStore.delete(`${GAME_SESSION_COOKIE_NAME}-${id}`);
    return null;
  }
}
