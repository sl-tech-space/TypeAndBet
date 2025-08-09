import { Metadata } from "next";
import { type ReactNode } from "react";

import { META_KEYWORDS, META_TITLE, META_DESCRIPTION } from "@/constants";
import { createMetadata } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata(
    META_TITLE.PLAY,
    META_DESCRIPTION.PLAY,
    META_KEYWORDS.PLAY
  );
}

export default function PlayLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return <>{children}</>;
}
