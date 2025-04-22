import styles from "./page.module.scss";
import { ModeSelector } from "@/features/games";
import { MessageProvider, Supporter } from "@/components/common";

export default function Home() {
  return (
    <MessageProvider>
      <section className={styles.container}>
        <div className={styles.container__left}></div>
        <div className={styles.container__center}>
          <ModeSelector />
        </div>
        <div className={styles.container__right}></div>
      </section>
      <section className={styles.container}>
        <div className={styles.container__left}></div>
        <div className={styles.container__center}>
          {/* ランキングコンテンツがここに入ります */}
        </div>
        <div className={styles.container__right}></div>
      </section>
      <Supporter />
    </MessageProvider>
  );
}
