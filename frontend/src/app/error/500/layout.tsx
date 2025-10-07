import { Metadata } from "next";

import { type ReactNode } from "react";

import { META_DESCRIPTION, META_KEYWORDS, META_TITLE } from "@/constants";
import { createMetadata } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata(
    META_TITLE.SERVER_ERROR,
    META_DESCRIPTION.SERVER_ERROR,
    META_KEYWORDS.SERVER_ERROR
  );
}

export default function ServerErrorLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return children;
}
