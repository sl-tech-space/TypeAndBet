import { Metadata } from "next";
import { createMetadata } from "@/utils";
import { META_TITLE, META_DESCRIPTION, META_KEYWORDS } from "@/constants";

/**
 * メタデータを動的に生成
 * @returns メタデータ
 */
export async function generateMetadata(): Promise<Metadata> {
  return createMetadata(
    META_TITLE.SIGNUP,
    META_DESCRIPTION.SIGNUP,
    META_KEYWORDS.SIGNUP
  );
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
