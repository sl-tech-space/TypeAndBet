import { Metadata } from "next";
import { type ReactNode } from "react";

import { META_DESCRIPTION, META_KEYWORDS, META_TITLE } from "@/constants";
import { createMetadata } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata(
    META_TITLE.TERMS,
    META_DESCRIPTION.TERMS,
    META_KEYWORDS.TERMS
  );
}

export default function TermsOfServiceLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return children;
}
