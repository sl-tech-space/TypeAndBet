import { type ReactElement } from "react";

import { GAME_MODE_ID } from "@/constants";
import { GoldBetCard } from "@/features/betting";

import styles from "./page.module.scss";

export default function PlayPage(): ReactElement {
  const balance = 1000;

  return (
    <section className={styles.container}>
      <GoldBetCard balance={balance} gameModeId={GAME_MODE_ID.PLAY} />
    </section>
  );
}
