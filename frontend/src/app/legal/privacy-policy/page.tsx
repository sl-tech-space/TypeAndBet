import fs from "fs";
import path from "path";

import { type ReactElement } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { LEGAL_FILE_NAME, LEGAL_PATH, MARKED_ENCODING } from "@/constants";

import styles from "../legal.module.scss";

export default function PrivacyPolicyPage(): ReactElement {
  const filePath: string = path.join(
    process.cwd(),
    "public",
    LEGAL_PATH.PRIVACY_POLICY,
    LEGAL_FILE_NAME.PRIVACY_POLICY
  );
  const markdown: string = fs.readFileSync(filePath, MARKED_ENCODING);

  return (
    <div className={styles.legal}>
      <div className={styles.legal__container}>
        <header className={styles.legal__header}>
          <h1>プライバシーポリシー</h1>
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
