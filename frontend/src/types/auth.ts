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
export interface OAuthResponse extends Record<string, unknown> {
  googleAuth: {
    user: {
      id: string;
      name: string;
      email: string;
      icon?: string;
      gold: number;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresAt: number;
    };
  };
}

/**
 * ログインレスポンス
 */
export interface LoginUserResponse extends Record<string, unknown> {
  loginUser: {
    success: boolean;
    errors?: string[];
    user?: {
      id: string;
      name: string;
      email: string;
      icon?: string;
      gold: number;
    };
    tokens?: {
      accessToken: string;
      refreshToken: string;
      expiresAt: string;
    };
  };
}

/**
 * サインアップレスポンス
 */
export interface SignupUserResponse extends Record<string, unknown> {
  registerUser: {
    success: boolean;
    errors?: string[];
  };
}

/**
 * メールアドレス確認レスポンス
 */
export interface VerifyEmailResponse extends Record<string, unknown> {
  verifyEmail: {
    success: boolean;
    message?: string;
    errors?: string[];
  };
}

/**
 * メール確認メール再送信レスポンス
 */
export interface ResendVerificationEmailResponse
  extends Record<string, unknown> {
  resendVerificationEmail: {
    success: boolean;
    errors?: string[];
  };
}

/**
 * トークン更新レスポンス
 */
export interface RefreshTokenResponse extends Record<string, unknown> {
  refreshToken: {
    success: boolean;
    errors?: string[];
    tokens?: {
      accessToken: string;
      refreshToken: string;
      expiresAt: number;
    };
  } | null;
}
