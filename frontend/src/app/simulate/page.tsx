import styles from "./page.module.scss";
import { GoldBetCard } from "@/features/betting";
import { GAME_MODE_ID } from "@/constants";

export default function SimulatePage() {
  const balance = 1000;

  return (
    <section className={styles.container}>
      <GoldBetCard balance={balance} gameModeId={GAME_MODE_ID.SIMULATE} />
    </section>
  );
}
