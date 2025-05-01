import { GraphQLServerClient, GOOGLE_AUTH, REFRESH_TOKEN } from "@/graphql";

/**
 * 認証サービスクラス
 */
export class AuthService {
  private static get graphqlClient() {
    return GraphQLServerClient.getInstance();
  }

  /**
   * Google認証を行う
   * @param email メールアドレス
   * @param name 名前
   * @param icon アイコン
   * @returns
   */
  public static async googleAuth(email: string, name: string, icon?: string) {
    const variables = {
      email,
      name,
      ...(icon && { icon }),
    };

    return this.graphqlClient.executeMutation(GOOGLE_AUTH, variables);
  }

  /**
   * トークンをリフレッシュ
   * @param refreshToken リフレッシュトークン
   * @returns
   */
  public static async refreshToken(refreshToken: string) {
    return this.graphqlClient.executeMutation(REFRESH_TOKEN, { refreshToken });
  }
}
