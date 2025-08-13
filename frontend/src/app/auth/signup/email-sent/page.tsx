import { type ReactElement } from "react";

import { META_TITLE } from "@/constants";
import { AuthCard, EmailSent } from "@/features/auth";

import styles from "./page.module.scss";

export default function SignupEmailSent(): ReactElement {
  return (
    <section className={styles.container}>
      <AuthCard title={META_TITLE.SIGNUP_EMAIL_SENT}>
        <EmailSent />
      </AuthCard>
    </section>
  );
}
