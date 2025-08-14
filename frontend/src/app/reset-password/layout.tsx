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
    META_TITLE.PASSWORD_RESET,
    META_DESCRIPTION.PASSWORD_RESET,
    META_KEYWORDS.PASSWORD_RESET
  );
}

export default function ResetPasswordLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return children;
}
