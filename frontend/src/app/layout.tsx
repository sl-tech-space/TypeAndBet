import "./globals.css";
import { createMetadata } from "@/utils";
import { META_TITLE, META_DESCRIPTION, META_KEYWORDS } from "@/constants";
import { Metadata } from "next";
import { Header, Footer } from "@/components/layouts";
import { Background } from "@/components/ui";
import "@/lib/apollo-server";

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
        <Background />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
