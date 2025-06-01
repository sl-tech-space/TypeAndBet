import styles from "./page.module.scss";
import { AuthCard, LoginForm, AuthActions } from "@/features/auth";

export default function Login() {
  return (
    <section className={styles.container}>
      <AuthCard title="ログイン">
        <LoginForm />
        <AuthActions />
      </AuthCard>
    </section>
  );
}
