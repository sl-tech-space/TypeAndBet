import type { Metadata } from "next";

import { SITE_NAME } from "@/constants";

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
  keywords: string
): Promise<Metadata> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://example.com";

  const fullTitle = `${SITE_NAME} | ${title}`;
  const ogImage = `${siteUrl}/assets/images/logo.png`;

  return {
    title: fullTitle,
    description,
    keywords,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      url: siteUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
    },
    manifest: "/site.webmanifest",
  };
}
