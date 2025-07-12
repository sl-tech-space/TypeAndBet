import { META_KEYWORDS, META_TITLE, META_DESCRIPTION } from "@/constants";
import { createMetadata } from "@/utils";
import { Metadata } from "next";

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
  children: React.ReactNode;
}) {
  return children;
}
