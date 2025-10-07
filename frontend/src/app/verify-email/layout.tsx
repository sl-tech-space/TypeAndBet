import { Metadata } from "next";

import { type ReactNode } from "react";

import { META_DESCRIPTION, META_KEYWORDS, META_TITLE } from "@/constants";
import { createMetadata } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata(
    META_TITLE.VERIFY_EMAIL,
    META_DESCRIPTION.VERIFY_EMAIL,
    META_KEYWORDS.VERIFY_EMAIL
  );
}

export default function VerifyEmailLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return children;
}
