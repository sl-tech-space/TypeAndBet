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
};

export const FORM_PLACEHOLDER = {
  EMAIL: "メールアドレスを入力してください",
  PASSWORD: "パスワードを入力してください",
};

export const AUTH_ACTIONS = {
  OR: "または",
  PASSWORD_FORGET: "パスワードを忘れた方はこちら",
  ALREADY_HAVE_ACCOUNT: "既にアカウントをお持ちの方はこちら",
};

////////////////////////////
// バリデーション
////////////////////////////

export const EMAIL_VALIDATION = {
  MAX_LENGTH: 255,
  PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  ERROR_MESSAGES: {
    REQUIRED: "メールアドレスを入力してください",
    INVALID: "メールアドレスが無効です",
  },
};

export const PASSWORD_VALIDATION = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 100,
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
    MIN_LENGTH: "パスワードは8文字以上で入力してください",
    MAX_LENGTH: "パスワードは255文字以下で入力してください",
    MIN_UPPERCASE: "大文字を2文字以上含める必要があります",
    MIN_NUMBER: "数字を2文字以上含める必要があります",
    MIN_SPECIAL_CHAR: "特殊文字を2文字以上含める必要があります",
    REQUIRED_CHARS: "英字（大文字・小文字）と数字を含める必要があります",
  },
};
