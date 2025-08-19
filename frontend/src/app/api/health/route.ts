import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    // 基本的なヘルスチェック
    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        service: "frontend",
        version: "15.4.6",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
