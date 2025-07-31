import { Metadata } from "next";
import { type ReactNode } from "react";

import { META_TITLE, META_DESCRIPTION, META_KEYWORDS } from "@/constants";
import { createMetadata } from "@/utils";

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
  children: ReactNode;
}): ReactNode {
  return children;
}
