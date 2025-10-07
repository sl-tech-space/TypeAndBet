import { Metadata } from "next";

import { type ReactNode } from "react";

import { META_DESCRIPTION, META_KEYWORDS, META_TITLE } from "@/constants";
import { createMetadata } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata(
    META_TITLE.NOT_FOUND,
    META_DESCRIPTION.NOT_FOUND,
    META_KEYWORDS.NOT_FOUND
  );
}

export default function NotFoundLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return children;
}
