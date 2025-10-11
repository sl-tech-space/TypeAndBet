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
    // Open Graph（Facebook、LINEなど）
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      url: siteUrl,
      siteName: SITE_NAME,
      locale: "ja_JP",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} - タイピングゲーム`,
          type: "image/png",
        },
      ],
    },
    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
      creator: "@TypeAndBet",
      site: "@TypeAndBet",
    },
    // その他のメタ情報
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/assets/images/logo.png",
    },
    manifest: "/site.webmanifest",
    // 追加のメタタグ
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    // アプリケーション名
    applicationName: SITE_NAME,
    // 作者情報
    authors: [{ name: SITE_NAME }],
    // カテゴリー
    category: "Game",
    // その他
    other: {
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
      "apple-mobile-web-app-title": SITE_NAME,
    },
  };
}
