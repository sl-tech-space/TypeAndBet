import {
  isValidMinusValue,
  maskEmail,
  removeSpaces,
  removeSpacesFromArray,
} from "./string";

const TEST_STRING = "Hello World";
const TEST_RESULT = "HelloWorld";
const TEST_STRING_ARRAY = ["He llo", "Wo rld"];
const TEST_RESULT_ARRAY = ["Hello", "World"];
const TEST_EMAIL = "test@example.com";
const TEST_MASKED_EMAIL = "te***@example.com";

describe("String Utils", () => {
  it("removeSpaces: スペースが削除された文字列を返す", () => {
    expect(removeSpaces(TEST_STRING)).toBe(TEST_RESULT);
  });

  it("removeSpaces: 文字列がnullの場合は空文字列を返す", () => {
    expect(removeSpaces(null as any)).toBe("");
  });

  it("removeSpaces: 文字列がundefinedの場合は空文字列を返す", () => {
    expect(removeSpaces(undefined as any)).toBe("");
  });

  it("removeSpacesFromArray: スペースが削除された文字列を返す", () => {
    expect(removeSpacesFromArray(TEST_STRING_ARRAY)).toStrictEqual(
      TEST_RESULT_ARRAY
    );
  });

  it("removeSpacesFromArray: 文字列配列がnullの場合は空配列を返す", () => {
    expect(removeSpacesFromArray(null as any)).toEqual([]);
  });

  it("removeSpacesFromArray: 文字列配列がundefinedの場合は空配列を返す", () => {
    expect(removeSpacesFromArray(undefined as any)).toEqual([]);
  });

  it("maskEmail: メールアドレスがマスクされた文字列を返す", () => {
    expect(maskEmail(TEST_EMAIL)).toBe(TEST_MASKED_EMAIL);
  });

  it("maskEmail: メールアドレスが2文字以下の場合はマスクされない", () => {
    expect(maskEmail("te@example.com")).toBe("te@example.com");
  });

  it("isValidMinusValue: マイナス値かどうかを判定する 結果: true", () => {
    expect(isValidMinusValue("-1")).toBe(true);
  });

  it("isValidMinusValue: マイナス値かどうかを判定する 結果: false", () => {
    expect(isValidMinusValue("1")).toBe(false);
  });

  it("isValidMinusValue: isNaNの場合はfalseを返す", () => {
    expect(isValidMinusValue("a")).toBe(false);
  });
});
