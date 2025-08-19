import { Suspense, type ReactElement } from "react";

import { Loading } from "@/components/ui";
import { EmailVerify } from "@/features/auth";

/**
 * メール認証ページ
 */
export default function VerifyEmailPage(): ReactElement {
  return (
    <Suspense fallback={<Loading />}>
      <EmailVerify />
    </Suspense>
  );
}

// 動的レンダリングを強制（useSearchParams()のため）
export const dynamic = "force-dynamic";
