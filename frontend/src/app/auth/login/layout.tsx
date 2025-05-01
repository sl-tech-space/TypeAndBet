import { Metadata } from "next";
import { createMetadata } from "@/utils";
import { META_TITLE, META_DESCRIPTION, META_KEYWORDS } from "@/constants";

/**
 * メタデータを動的に生成
 * @returns メタデータ
 */
export async function generateMetadata(): Promise<Metadata> {
  return createMetadata(
    META_TITLE.LOGIN,
    META_DESCRIPTION.LOGIN,
    META_KEYWORDS.LOGIN
  );
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
