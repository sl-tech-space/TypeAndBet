import { describe, expect, it } from "vitest";
import { isEmptyObject, isNull, isUndefined } from "./object";

describe("Object Utils", () => {
  it("isEmptyObject: 空のオブジェクトを渡したらtrueを返す", () => {
    expect(isEmptyObject({} as any)).toBe(true);
  });

  it("isEmptyObject: 空でないオブジェクトを渡したらfalseを返す", () => {
    expect(isEmptyObject({ a: 1 } as any)).toBe(false);
  });

  it("isEmptyObject: nullを渡したらtrueを返す", () => {
    expect(isEmptyObject(null as any)).toBe(true);
  });

  it("isEmptyObject: undefinedを渡したらtrueを返す", () => {
    expect(isEmptyObject(undefined as any)).toBe(true);
  });

  it("isUndefined: undefinedを渡したらtrueを返す", () => {
    expect(isUndefined(undefined as any)).toBe(true);
  });

  it("isNull: nullを渡したらtrueを返す", () => {
    expect(isNull(null as any)).toBe(true);
  });

  it("isNull: undefinedを渡したらfalseを返す", () => {
    expect(isNull(undefined as any)).toBe(false);
  });

  it("isUndefined: nullを渡したらfalseを返す", () => {
    expect(isUndefined(null as any)).toBe(false);
  });

  it("isUndefined: undefinedを渡したらtrueを返す", () => {
    expect(isUndefined(undefined as any)).toBe(true);
  });
});
