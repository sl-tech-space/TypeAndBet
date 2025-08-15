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
    META_TITLE.SIGNUP_EMAIL_SENT,
    META_DESCRIPTION.SIGNUP_EMAIL_SENT,
    META_KEYWORDS.SIGNUP_EMAIL_SENT
  );
}

export default function EmailSentLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return children;
}
