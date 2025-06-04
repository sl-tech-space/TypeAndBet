/**
 * 認証必須パスのインターフェース
 */
interface AuthPath {
  href: string;
  label: string;
}

/**
 * 認証必須パス
 */
export const AUTH_PATH: AuthPath[] = [
  { href: "/type-and-bet", label: "Type&Bet" },
];

/**
 * OAuthプロバイダーの型定義
 */
export type OAuthProvider = {
  GOOGLE: "google";
};

export const OAUTH_PROVIDER: OAuthProvider = {
  GOOGLE: "google",
};

/**
 * フォームラベルの型定義
 */
export type FormLabel = {
  EMAIL: string;
  PASSWORD: string;
  PASSWORD_CONFIRM: string;
  NAME: string;
};

export const FORM_LABEL: FormLabel = {
  EMAIL: "メールアドレス",
  PASSWORD: "パスワード",
  PASSWORD_CONFIRM: "パスワード確認",
  NAME: "ユーザ名",
};

export const FORM_PLACEHOLDER: Record<keyof FormLabel, string> = {
  EMAIL: "メールアドレスを入力してください",
  PASSWORD: "パスワードを入力してください",
  PASSWORD_CONFIRM: "パスワードを再入力してください",
  NAME: "ユーザ名を入力してください",
};

/**
 * 認証アクションの型定義
 */
export type AuthActions = {
  OR: string;
  PASSWORD_FORGET: string;
  ALREADY_HAVE_ACCOUNT: string;
  NO_ACCOUNT: string;
};

export const AUTH_ACTIONS: AuthActions = {
  OR: "または",
  PASSWORD_FORGET: "パスワードを忘れた方はこちら",
  ALREADY_HAVE_ACCOUNT: "既にアカウントをお持ちの方はこちら",
  NO_ACCOUNT: "アカウントをお持ちでない方はこちら",
};

/**
 * サインアップ成功メッセージの型定義
 */
export type SignupSuccessMessage = {
  SUCCESS: string;
  LOGIN_NAVIGATION: string;
  LOGIN_NAVIGATION_COUNT: string;
};

export const SIGNUP_SUCCESS_MESSAGE: SignupSuccessMessage = {
  SUCCESS: "様、登録ありがとうございます。",
  LOGIN_NAVIGATION: "ログイン画面からログインしてください。",
  LOGIN_NAVIGATION_COUNT: "秒後にログイン画面に遷移します...",
};

export const SIGNUP_SUCCESS_COUNTDOWN: number = 5; //5s
export const SIGNUP_SUCCESS_DECREMENT: number = 1; //1s
export const SIGNUP_SUCCESS_COUNTDOWN_MIN: number = 0; //0s

////////////////////////////
// バリデーション
////////////////////////////

/**
 * メールバリデーションの型定義
 */
export type EmailValidation = {
  MAX_LENGTH: number;
  PATTERN: RegExp;
  ERROR_MESSAGES: {
    REQUIRED: string;
    INVALID: string;
  };
};

export const EMAIL_VALIDATION: EmailValidation = {
  MAX_LENGTH: 254,
  PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  ERROR_MESSAGES: {
    REQUIRED: "メールアドレスを入力してください",
    INVALID: "メールアドレスが無効です",
  },
};

/**
 * パスワードバリデーションの型定義
 */
export type PasswordValidation = {
  MIN_LENGTH: number;
  MAX_LENGTH: number;
  MIN_UPPERCASE: number;
  MIN_LOWERCASE: number;
  MIN_NUMBER: number;
  MIN_SPECIAL_CHAR: number;
  PATTERN: {
    UPPERCASE: RegExp;
    LOWERCASE: RegExp;
    NUMBER: RegExp;
    SPECIAL_CHAR: RegExp;
  };
  ERROR_MESSAGES: {
    REQUIRED: string;
    MIN_LENGTH: string;
    MAX_LENGTH: string;
    MIN_UPPERCASE: string;
    MIN_NUMBER: string;
    MIN_SPECIAL_CHAR: string;
    REQUIRED_CHARS: string;
  };
};

export const PASSWORD_VALIDATION: PasswordValidation = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  MIN_UPPERCASE: 2,
  MIN_LOWERCASE: 2,
  MIN_NUMBER: 2,
  MIN_SPECIAL_CHAR: 2,
  PATTERN: {
    UPPERCASE: /[A-Z]/g,
    LOWERCASE: /[a-z]/g,
    NUMBER: /[0-9]/g,
    SPECIAL_CHAR: /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/g,
  },
  ERROR_MESSAGES: {
    REQUIRED: "パスワードを入力してください",
    MIN_LENGTH: "パスワードは8文字以上で入力してください",
    MAX_LENGTH: "パスワードは128文字以内で入力してください",
    MIN_UPPERCASE: "大文字を2文字以上含める必要があります",
    MIN_NUMBER: "数字を2文字以上含める必要があります",
    MIN_SPECIAL_CHAR: "特殊文字を2文字以上含める必要があります",
    REQUIRED_CHARS: "英字（大文字・小文字）と数字を含める必要があります",
  },
};

/**
 * ユーザー名バリデーションの型定義
 */
export type NameValidation = {
  MIN_LENGTH: number;
  MAX_LENGTH: number;
  PATTERN: RegExp;
  ERROR_MESSAGES: {
    REQUIRED: string;
    MIN_LENGTH: string;
    MAX_LENGTH: string;
    PATTERN: string;
  };
};

export const NAME_VALIDATION: NameValidation = {
  MIN_LENGTH: 1,
  MAX_LENGTH: 15,
  PATTERN: /^[a-zA-Z0-9]+$/,
  ERROR_MESSAGES: {
    REQUIRED: "ユーザ名を入力してください",
    MIN_LENGTH: "ユーザ名は1文字以上で入力してください",
    MAX_LENGTH: "ユーザ名は15文字以下で入力してください",
    PATTERN: "ユーザ名は英数字で入力してください",
  },
};
