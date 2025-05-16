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
