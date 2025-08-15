import { Suspense, type ReactElement } from "react";

import { Loading } from "@/components/ui";
import { AuthCard, PasswordResetForm } from "@/features/auth";

import { META_TITLE } from "@/constants";
import styles from "./page.module.scss";

/**
 * パスワードリセットページ
 * @returns パスワードリセットページコンポーネント
 */
export default function ResetPasswordPage(): ReactElement {
  return (
    <div className={styles.container}>
      <AuthCard title={META_TITLE.PASSWORD_RESET}>
        <Suspense fallback={<Loading />}>
          <PasswordResetForm />
        </Suspense>
      </AuthCard>
    </div>
  );
}
