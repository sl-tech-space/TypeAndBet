import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Type and Bet</h1>
        <p className={styles.description}>
          タイピングで腕前を競い合おう！練習モード、タイムアタック、ベットモードで楽しめます。
        </p>

        <div className={styles.ctas}>
          <Link className={styles.primary} href="/typing-games">
            タイピングゲームを始める
          </Link>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            使い方を見る
          </a>
        </div>
        
        <div className={styles.features}>
          <div className={styles.feature}>
            <h2>練習モード</h2>
            <p>自分のペースでタイピング練習。難易度を選んで腕を磨こう！</p>
          </div>
          <div className={styles.feature}>
            <h2>タイムアタック</h2>
            <p>制限時間内にどれだけタイプできるか挑戦！自己ベストを更新しよう。</p>
          </div>
          <div className={styles.feature}>
            <h2>ベットモード</h2>
            <p>他のプレイヤーと対戦して賭けに勝とう！実力が試されます。</p>
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          学ぶ
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          例
        </a>
        <Link href="/typing-games">
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          タイピングゲームへ →
        </Link>
      </footer>
    </div>
  );
}
