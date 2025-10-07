import { Metadata } from "next";

import { type ReactNode } from "react";

import { META_DESCRIPTION, META_KEYWORDS, META_TITLE } from "@/constants";
import { createMetadata } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata(
    META_TITLE.PRIVACY,
    META_DESCRIPTION.PRIVACY,
    META_KEYWORDS.PRIVACY
  );
}

export default function PrivacyPolicyLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return children;
}
