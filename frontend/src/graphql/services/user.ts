import { SESSION_GOLD_UPDATE } from "../queries/user";
import { GraphQLServerClient } from "../utils";

import type { SessionGoldUpdateResponse } from "@/types/user";

export class UserService {
  private static get graphqlClient(): GraphQLServerClient {
    return GraphQLServerClient.getInstance();
  }

  public static async sessionGoldUpdate(
    id: string
  ): Promise<{ data: SessionGoldUpdateResponse }> {
    return this.graphqlClient.executeQuery<
      SessionGoldUpdateResponse,
      { userId: string }
    >(SESSION_GOLD_UPDATE, {
      userId: id,
    });
  }
}
