import styles from "./page.module.scss";
import { TypingCard, TimerCard, DetailCard } from "@/features/games";
import { HomeButton } from "@/features/helper";
import { TypingProvider } from "@/features/games/contexts/TypingContext";

export default function SimulateByIdPage() {
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
