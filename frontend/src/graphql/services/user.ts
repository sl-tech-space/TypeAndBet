import { GET_USER_GOLD } from "../queries/user";
import { GraphQLServerClient } from "../utils";

import type { GetGoldResponse } from "@/types/user";

export class UserService {
  public static async getGold(
    client: GraphQLServerClient,
    id: string
  ): Promise<{ data: GetGoldResponse }> {
    return client.executeQuery<GetGoldResponse, { userId: string }>(
      GET_USER_GOLD,
      {
        userId: id,
      }
    );
  }
}
