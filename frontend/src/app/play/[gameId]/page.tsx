import {
  TypingCard,
  TimerCard,
  DetailCard,
  TypingProvider,
} from "@/features/games";
import { HomeButton } from "@/features/helper";

import styles from "./page.module.scss";

export default async function PlayByIdPage(): Promise<React.ReactNode> {
  return (
    <TypingProvider>
      <section className={styles.container}>
        <div className={styles.container__sub}>
          <div className={styles.container__sub__top}>
            <TimerCard />
            <HomeButton />
          </div>
        </div>
        <div className={styles.container__main}>
          <TypingCard />
        </div>
        <div className={styles.container__sub}>
          <div className={styles.container__sub__bottom}>
            <DetailCard />
          </div>
        </div>
      </section>
    </TypingProvider>
  );
}
