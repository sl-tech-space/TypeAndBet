import { NextResponse } from "next/server";

import { getAndDeleteGameResult } from "@/actions/result";

/**
 * ゲーム結果を取得
 * サーバアクションを呼び出す
 * ※サーバコンポーネントから初期呼び出しができないため、API経由で取得する
 */
export async function GET(): Promise<NextResponse> {
  try {
    const result = await getAndDeleteGameResult();
    return NextResponse.json({ result });
  } catch (error) {
    console.error("ゲーム結果の取得に失敗:", error);
    return NextResponse.json({ result: null });
  }
}
