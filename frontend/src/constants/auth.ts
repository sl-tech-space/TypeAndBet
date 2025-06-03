/**
 * 認証必須パス
 */
export const AUTH_PATH = [{ href: "/type-and-bet", label: "Type&Bet" }];

export const OAUTH_PROVIDER = {
  GOOGLE: "google",
};

export const FORM_LABEL = {
  EMAIL: "メールアドレス",
  PASSWORD: "パスワード",
  PASSWORD_CONFIRM: "パスワード確認",
  NAME: "ユーザ名",
};

export const FORM_PLACEHOLDER = {
  EMAIL: "メールアドレスを入力してください",
  PASSWORD: "パスワードを入力してください",
  PASSWORD_CONFIRM: "パスワードを再入力してください",
  NAME: "ユーザ名を入力してください",
};

export const AUTH_ACTIONS = {
  OR: "または",
  PASSWORD_FORGET: "パスワードを忘れた方はこちら",
  ALREADY_HAVE_ACCOUNT: "既にアカウントをお持ちの方はこちら",
  NO_ACCOUNT: "アカウントをお持ちでない方はこちら",
};

export const SIGNUP_SUCCESS_MESSAGE = {
  SUCCESS: "様、登録ありがとうございます。",
  LOGIN_NAVIGATION: "ログイン画面からログインしてください。",
  LOGIN_NAVIGATION_COUNT: "秒後にログイン画面に遷移します...",
};

export const SIGNUP_SUCCESS_COUNTDOWN = 5; //5s
export const SIGNUP_SUCCESS_DECREMENT = 1; //1s
export const SIGNUP_SUCCESS_COUNTDOWN_MIN = 0; //0s
export const SIGNUP_SUCCESS_COUNTDOWN_INTERVAL = 1000; //1000ms

////////////////////////////
// バリデーション
////////////////////////////

export const EMAIL_VALIDATION = {
  MAX_LENGTH: 254,
  PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  ERROR_MESSAGES: {
    REQUIRED: "メールアドレスを入力してください",
    INVALID: "メールアドレスが無効です",
  },
};

export const PASSWORD_VALIDATION = {
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

export const NAME_VALIDATION = {
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
