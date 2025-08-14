import { type ReactElement } from "react";

import { AuthCard, PasswordForgetForm } from "@/features/auth";

import { META_TITLE } from "@/constants";
import styles from "./page.module.scss";

/**
 * パスワードリセット要求ページ
 * @returns パスワードリセット要求ページコンポーネント
 */
export default function PasswordForgetPage(): ReactElement {
  return (
    <section className={styles.container}>
      <AuthCard title={META_TITLE.PASSWORD_FORGET}>
        <PasswordForgetForm />
      </AuthCard>
    </section>
  );
}
