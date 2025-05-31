import { GraphQLServerClient } from "../utils";
import { SESSION_GOLD_UPDATE } from "../queries/user";

export class UserService {
  private static get graphqlClient() {
    return GraphQLServerClient.getInstance();
  }

  public static async sessionGoldUpdate(id: string) {
    return this.graphqlClient.executeQuery(SESSION_GOLD_UPDATE, {
      userId: id,
    });
  }
}
