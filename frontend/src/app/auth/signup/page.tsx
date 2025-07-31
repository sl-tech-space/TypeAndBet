import { type ReactElement } from "react";

import { META_TITLE } from "@/constants";
import { AuthCard, SignupForm, AuthActions } from "@/features/auth";

import styles from "./page.module.scss";

export default function Signup(): ReactElement {
  return (
    <section className={styles.container}>
      <AuthCard title={META_TITLE.SIGNUP}>
        <SignupForm />
        <AuthActions />
      </AuthCard>
    </section>
  );
}
