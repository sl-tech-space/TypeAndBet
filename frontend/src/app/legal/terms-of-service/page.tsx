import fs from "fs";
import path from "path";

import { type ReactElement } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { LEGAL_FILE_NAME, LEGAL_PATH, MARKED_ENCODING } from "@/constants";

import styles from "../legal.module.scss";

/**
 * 利用規約ページコンポーネント
 * @returns 利用規約ページコンポーネント
 */
export default function TermsOfServicePage(): ReactElement {
  const filePath: string = path.join(
    process.cwd(),
    "public",
    LEGAL_PATH.TERMS_OF_SERVICE,
    LEGAL_FILE_NAME.TERMS_OF_SERVICE
  );
  const markdown: string = fs.readFileSync(filePath, MARKED_ENCODING);

  return (
    <div className={styles.legal}>
      <div className={styles.legal__container}>
        <header className={styles.legal__header}>
          <h1>利用規約</h1>
        </header>
        <main className={styles.legal__content}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </main>
        <footer className={styles.legal__footer}>
          <p>
            最終更新日: {new Date().getFullYear()}年{new Date().getMonth() + 1}
            月{new Date().getDate()}日
          </p>
        </footer>
      </div>
    </div>
  );
}
