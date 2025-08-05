import { SESSION_GOLD_UPDATE } from "../queries/user";
import { GraphQLServerClient } from "../utils";

import type { SessionGoldUpdateResponse } from "@/types/user";

export class UserService {
  public static async sessionGoldUpdate(
    client: GraphQLServerClient,
    id: string
  ): Promise<{ data: SessionGoldUpdateResponse }> {
    return client.executeQuery<SessionGoldUpdateResponse, { userId: string }>(
      SESSION_GOLD_UPDATE,
      {
        userId: id,
      }
    );
  }
}
