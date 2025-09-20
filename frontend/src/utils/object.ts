/**
 * オブジェクトが空かどうかを判定する
 * @param obj 対象のオブジェクト
 * @returns 空かどうか（nullとundefinedの場合もtrueを返す）
 */
export const isEmptyObject = (obj: object | null | undefined): boolean => {
  if (obj === null || obj === undefined) return true;
  return Object.keys(obj).length === 0;
};

/**
 * オブジェクトがundefinedかどうかを判定する
 * @param obj 対象のオブジェクト
 * @returns undefinedかどうか
 */
export const isUndefined = (obj: object | undefined): boolean => {
  return obj === undefined;
};

/**
 * オブジェクトがnullかどうかを判定する
 * @param obj 対象のオブジェクト
 * @returns nullかどうか
 */
export const isNull = (obj: object | null): boolean => {
  return obj === null;
};
