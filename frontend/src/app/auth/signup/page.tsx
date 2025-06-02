import styles from "./page.module.scss";
import { META_TITLE } from "@/constants";
import { AuthCard, SignupForm, AuthActions } from "@/features/auth";

export default function Login() {
  return (
    <section className={styles.container}>
      <AuthCard title={META_TITLE.SIGNUP}>
        <SignupForm />
        <AuthActions />
      </AuthCard>
    </section>
  );
}
