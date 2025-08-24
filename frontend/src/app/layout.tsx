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

  return (
    <html lang="ja">
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
