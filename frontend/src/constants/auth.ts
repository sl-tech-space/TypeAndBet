import { ROUTE } from "./route";

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
export const AUTH_PATH: AuthPath[] = [{ href: ROUTE.PLAY, label: "Type&Bet" }];

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
 * メール送信完了ページの文言
 */
export type EmailSentMessage = {
  TITLE: string;
  MAIN_MESSAGE: string;
  INSTRUCTION: string;
  NOTE: string;
  LOGIN_BUTTON: string;
  HOME_BUTTON: string;
  RESEND_BUTTON: string;
  RESEND_SUCCESS: string;
  RESEND_ERROR: string;
  RESEND_COOLDOWN: string;
};

export const EMAIL_SENT_MESSAGE: EmailSentMessage = {
  TITLE: "メールを確認してください",
  MAIN_MESSAGE:
    "ご登録いただいたメールアドレス宛に、認証メールを送信いたしました。",
  INSTRUCTION:
    "メールに記載されたリンクをクリックして、アカウントの認証を完了してください。",
  NOTE: "※ メールが届かない場合は、迷惑メールフォルダもご確認ください",
  LOGIN_BUTTON: "ログインページへ",
  HOME_BUTTON: "ホームへ戻る",
  RESEND_BUTTON: "認証メールを再送信",
  RESEND_SUCCESS: "認証メールを再送信いたしました",
  RESEND_ERROR: "メールの再送信に失敗しました",
  RESEND_COOLDOWN: "秒後に再送信できます",
};

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
  MIN_SPECIAL_CHAR: 1,
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
    MIN_SPECIAL_CHAR: "特殊文字を1文字以上含める必要があります",
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
