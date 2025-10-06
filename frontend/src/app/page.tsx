import { type ReactElement } from "react";

import { IntroCard, MessageProvider, Supporter } from "@/components/common";
import { ModeSelectorWrapper } from "@/features/games";
import { RankingCard } from "@/features/ranking";

import styles from "./page.module.scss";

export default function Home(): ReactElement {
  return (
    <MessageProvider>
      <section className={styles.container}>
        <div className={styles.container__left}>
          <IntroCard />
        </div>
        <div className={styles.container__center}>
          <ModeSelectorWrapper />
        </div>
        <div className={styles.container__right}>
          <RankingCard />
        </div>
      </section>
      <Supporter />
    </MessageProvider>
  );
}
