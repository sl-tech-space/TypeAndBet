import { type ReactElement } from "react";

import styles from "./Loading.module.scss";

export const Loading = (): ReactElement => (
  <div className={styles.loading} role="status" aria-label="読み込み中">
    {[...Array(5)].map((_, index) => (
      <div key={index} className={styles.loading__dot} />
    ))}
    <span className={styles.loading__sr_only}>読み込み中...</span>
  </div>
);
