import { Metadata } from "next";

import { META_KEYWORDS, META_TITLE, META_DESCRIPTION } from "@/constants";
import { createMetadata } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata(
    META_TITLE.PLAY,
    META_DESCRIPTION.PLAY,
    META_KEYWORDS.PLAY
  );
}

export default function PlayByIdLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return children;
}
