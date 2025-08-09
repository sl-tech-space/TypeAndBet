/**
 * stringUtil内の定数
 */
const REGEX_SPACE: RegExp = /[\s\u3000\t\n]/g;
const EMAIL_VISIBLE_CHARS: number = 2; // メールアドレスの先頭で表示する文字数

/**
 * 文字列からスペースを削除する
 * @param str 対象の文字列
 * @returns スペースが削除された文字列
 */
export const removeSpaces = (str: string): string => {
  if (!str) return "";
  // 半角スペース、全角スペース、タブ、改行を削除
  return str.replace(REGEX_SPACE, "");
};

/**
 * 文字列配列からスペースを削除する
 * @param strArray 対象の文字列配列
 * @returns スペースが削除された文字列配列
 */
export const removeSpacesFromArray = (strArray: string[]): string[] => {
  if (!strArray || !Array.isArray(strArray)) return [];
  return strArray.map((str) => removeSpaces(str));
};

/**
 * メールアドレスをマスク処理する関数
 * @param email メールアドレス
 * @returns マスク処理されたメールアドレス
 */
export const maskEmail = (email: string): string => {
  const atIndex = email.indexOf("@");
  if (atIndex <= EMAIL_VISIBLE_CHARS) return email;
  return email.slice(0, EMAIL_VISIBLE_CHARS) + "***" + email.slice(atIndex);
};

/**
 * 文字列がマイナス値かどうかを判定する
 * @param value 対象の文字列
 * @returns マイナス値かどうか
 */
export const isValidMinusValue = (value: string): boolean => {
  return value.startsWith("-") && !isNaN(Number(value));
};
