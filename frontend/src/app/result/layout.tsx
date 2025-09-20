import { Metadata } from "next";
import { type ReactNode } from "react";

import { META_KEYWORDS, META_TITLE, META_DESCRIPTION } from "@/constants";
import { createMetadata } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata(
    META_TITLE.RESULT,
    META_DESCRIPTION.RESULT,
    META_KEYWORDS.RESULT
  );
}

export default function ResultLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return children;
}
