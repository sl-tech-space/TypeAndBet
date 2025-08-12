"use server";

import { auth } from "@/auth";
import { GraphQLServerClient, UserService } from "@/graphql";
import { getAuthorizedServerClient } from "@/lib/apollo-server";

/**
 * サーバーサイドでユーザーの所持ゴールドを取得する
 */
export async function getUserGold(): Promise<number> {
  const session = await auth();

  if (!session || !session.user?.id) {
    return 0;
  }

  const rawClient = await getAuthorizedServerClient();
  const { data } = await UserService.getGold(
    new GraphQLServerClient(rawClient),
    session.user.id
  );

  const gold: number = data.user.gold;
  if (!gold && gold !== 0) {
    return 0;
  }

  return gold;
}
