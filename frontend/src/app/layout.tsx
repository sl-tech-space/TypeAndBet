import { Metadata } from "next";

import { headers } from "next/headers";
import Script from "next/script";

import { type ReactNode } from "react";

import { Footer, Header } from "@/components/layouts";
import { Background } from "@/components/ui";
import {
  META_DESCRIPTION,
  META_KEYWORDS,
  META_TITLE,
  NODE_ENV,
} from "@/constants";
import { createMetadata } from "@/utils";
import "./globals.css";

/**
 * メタデータを動的に生成
 * @returns メタデータ
 */
export async function generateMetadata(): Promise<Metadata> {
  return createMetadata(
    META_TITLE.HOME,
    META_DESCRIPTION.HOME,
    META_KEYWORDS.HOME
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): Promise<React.ReactElement> {
  const headersList = await headers();
  const nonce = headersList.get("x-content-security-policy-nonce");
  const isDevelopment = process.env.NODE_ENV === NODE_ENV.DEVELOPMENT;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  return (
    <html lang="ja">
      <head>
        {/* JSON-LD: Organization 構造化データ */}
        <script
          type="application/ld+json"
          nonce={nonce ?? undefined}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Type&Bet",
              alternateName: [
                "TypeAndBet",
                "Type And Bet",
                "タイプアンドベット",
                "タイプ & ベット",
              ],
              url: siteUrl,
              logo: `${siteUrl}/assets/images/logo.png`,
              description:
                "無料のタイピングゲームでスキルアップ。初心者から上級者まで楽しめるオンラインタイピング練習サイト。",
              sameAs: [],
            }),
          }}
        />

        {/* JSON-LD: WebApplication 構造化データ */}
        <script
          type="application/ld+json"
          nonce={nonce ?? undefined}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Type&Bet - タイピングゲーム",
              applicationCategory: "GameApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "JPY",
              },
              description:
                "無料のオンラインタイピングゲーム。タイピング速度と正確性を向上させる練習サイト。",
              url: siteUrl,
              screenshot: `${siteUrl}/assets/images/logo.png`,
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.5",
                ratingCount: "100",
                bestRating: "5",
                worstRating: "1",
              },
              featureList: [
                "無料でタイピング練習",
                "リアルタイム対戦モード",
                "タイピング速度測定",
                "ランキングシステム",
                "AI生成文章",
              ],
            }),
          }}
        />

        {/* JSON-LD: Game 構造化データ */}
        <script
          type="application/ld+json"
          nonce={nonce ?? undefined}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoGame",
              name: "Type&Bet",
              genre: "タイピングゲーム",
              gamePlatform: "Web Browser",
              description:
                "タイピングスキルを競い合う無料オンラインゲーム。練習モードと対戦モードで楽しくスキルアップ。",
              url: siteUrl,
              image: `${siteUrl}/assets/images/logo.png`,
              author: {
                "@type": "Organization",
                name: "Type&Bet",
              },
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "JPY",
              },
              applicationCategory: "Game",
            }),
          }}
        />

        {/* JSON-LD: BreadcrumbList 構造化データ */}
        <script
          type="application/ld+json"
          nonce={nonce ?? undefined}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "ホーム",
                  item: siteUrl,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "タイピング練習",
                  item: `${siteUrl}/simulate`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "タイピング対戦",
                  item: `${siteUrl}/play`,
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        <Background />
        <Header />
        <main>{children}</main>
        <Footer />
        {isDevelopment && <Script nonce={nonce ?? undefined} />}
      </body>
    </html>
  );
}
