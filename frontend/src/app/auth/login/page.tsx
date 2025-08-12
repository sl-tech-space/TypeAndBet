import { type ReactElement } from "react";

import { META_TITLE } from "@/constants";
import { AuthCard, LoginForm, AuthActions } from "@/features/auth";

import styles from "./page.module.scss";

export default function Login(): ReactElement {
  return (
    <section className={styles.container}>
      <AuthCard title={META_TITLE.LOGIN}>
        <LoginForm />
        <AuthActions />
      </AuthCard>
    </section>
  );
}
