import { SessionProvider } from "next-auth/react";
import { type ReactElement } from "react";

import styles from "./page.module.scss";

import { PlayPageContent } from "@/app/play/PlayPageContent";

/**
 * PlayPage - SessionProviderでラップしてセッション管理を可能にする
 * @returns プレイページ
 */
export default function PlayPage(): ReactElement {
  return (
    <SessionProvider>
      <section className={styles.container}>
        <PlayPageContent />
      </section>
    </SessionProvider>
  );
}
