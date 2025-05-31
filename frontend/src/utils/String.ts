/**
 * 文字列からスペースを削除する
 * @param str 対象の文字列
 * @returns スペースが削除された文字列
 */
export const removeSpaces = (str: string): string => {
  if (!str) return "";
  // 半角スペース、全角スペース、タブ、改行を削除
  return str.replace(/[\s\u3000\t\n]/g, "");
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
export const maskEmail = (email: string) => {
  const atIndex = email.indexOf("@");
  if (atIndex <= 2) return email;
  return email.slice(0, 2) + "***" + email.slice(atIndex);
};
