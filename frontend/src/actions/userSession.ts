"use server";

import { auth } from "@/auth";
import { UserService, GraphQLServerClient } from "@/graphql";
import { getAuthorizedServerClient } from "@/lib/apollo-server";

/**
 * サーバーサイドでユーザーの所持ゴールドを取得する
 */
export async function getUserGold(): Promise<number> {
  const session = await auth();

  if (!session || !session.user?.id) {
    throw new Error("認証されていません");
  }

  const rawClient = await getAuthorizedServerClient();
  const { data } = await UserService.getGold(
    new GraphQLServerClient(rawClient),
    session.user.id
  );

  const gold: number = data.userInfo.gold;
  if (!gold && gold !== 0) {
    throw new Error("ゴールドの取得に失敗しました");
  }

  return data.userInfo.gold;
}
