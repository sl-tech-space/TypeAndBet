import { type ReactElement } from "react";

import { ResultCard } from "@/features/result/components";

import styles from "./page.module.scss";

export default function ResultPage(): ReactElement {
  return (
    <section className={styles.container}>
      <div className={styles.container__upper}>
        <div className={styles.container__left}></div>
        <div className={styles.container__center}>
          <ResultCard />
        </div>
        <div className={styles.container__right}></div>
      </div>
      <div className={styles.container__bottom}>
        {/* 下部コンテンツをここに配置 */}
      </div>
    </section>
  );
}