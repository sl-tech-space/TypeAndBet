/**
 * ログイン資格情報
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * サインアップ資格情報
 */
export interface SignupCredentials {
  email: string;
  name: string;
  password: string;
}

/**
 * OAuth認証レスポンス
 */
export interface OAuthResponse {
  oauthAuthenticate?: {
    user: {
      id: string;
      name: string;
      email: string;
      icon?: string;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresAt: number;
    };
  };
}

/**
 * トークン更新レスポンス
 */
export interface RefreshTokenResponse {
  refreshToken?: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  };
}
