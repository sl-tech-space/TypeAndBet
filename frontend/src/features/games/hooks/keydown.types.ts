import { TYPE_JUDGE } from "@/constants";

/**
 * キーダウンイベントの型
 * キーダウンイベントを受け取り、キーの押されたキーとコードを返す
 */
export type KeydownEvent = {
  key: string;
  code: string;
  result?: typeof TYPE_JUDGE.CORRECT | typeof TYPE_JUDGE.INCORRECT;
};
