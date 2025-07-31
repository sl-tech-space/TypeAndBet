import { SITE_NAME } from "@/constants";

import type { Metadata } from "next";

/**
 * メタデータを生成する
 * @param title タイトル
 * @param description 説明
 * @param keywords キーワード
 * @returns メタデータ
 */
export async function createMetadata(
    title: string,
    description: string,
    keywords: string,
): Promise<Metadata> {
  return {
    title: `${SITE_NAME} | ${title}`,
    description: description,
    keywords: keywords,
  };
}
