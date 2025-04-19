import "./globals.css";
import { createMetadata } from "@/utils";
import { META_TITLE, META_DESCRIPTION, META_KEYWORDS } from "@/constants";
import { Metadata } from "next";
import { Header } from "@/components/layouts/Header";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
