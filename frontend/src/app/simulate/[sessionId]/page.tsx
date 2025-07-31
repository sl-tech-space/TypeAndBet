import { notFound } from "next/navigation";

import { isValidGameSession } from "@/actions";
import {
  TypingCard,
  TimerCard,
  DetailCard,
  TypingProvider,
} from "@/features/games";
import { HomeButton } from "@/features/helper";

import styles from "./page.module.scss";

import type { GameSessionIdProps } from "@/types";

export default async function SimulateByIdPage({
  params,
}: GameSessionIdProps): Promise<React.ReactNode> {
  const { sessionId } = await params;
  const isValid = await isValidGameSession(sessionId);
  if (!isValid) {
    notFound();
  }

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
