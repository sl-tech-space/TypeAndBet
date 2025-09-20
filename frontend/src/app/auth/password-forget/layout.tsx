import { Metadata } from "next";
import { type ReactNode } from "react";

import { META_DESCRIPTION, META_KEYWORDS, META_TITLE } from "@/constants";
import { createMetadata } from "@/utils";

/**
 * メタデータを動的に生成
 * @returns メタデータ
 */
export async function generateMetadata(): Promise<Metadata> {
  return createMetadata(
    META_TITLE.PASSWORD_FORGET,
    META_DESCRIPTION.PASSWORD_FORGET,
    META_KEYWORDS.PASSWORD_FORGET
  );
}

export default function PasswordForgetLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return children;
}
