import { Metadata } from "next";

import { META_KEYWORDS, META_TITLE, META_DESCRIPTION } from "@/constants";
import { createMetadata } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata(
    META_TITLE.SIMULATE,
    META_DESCRIPTION.SIMULATE,
    META_KEYWORDS.SIMULATE
  );
}

export default function SimulateByIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
