import { type ReactElement } from "react";

import { MessageProvider, Supporter } from "@/components/common";
import { ModeSelectorWrapper } from "@/features/games";

import styles from "./page.module.scss";

export default function Home(): ReactElement {
  return (
    <MessageProvider>
      <section className={styles.container}>
        <div className={styles.container__left}></div>
        <div className={styles.container__center}>
          <ModeSelectorWrapper />
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
