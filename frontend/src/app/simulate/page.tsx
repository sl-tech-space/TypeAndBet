import styles from "./page.module.scss";
import { GoldBetCard } from "@/features/betting";

export default function SimulatePage() {
  // サーバーサイドでデータ取得
  // 実際の実装ではここでDBなどからデータを取得します
  const balance = 1000; // ダミーデータ

  // ベット処理を行うサーバーアクション
  // この関数はクライアントコンポーネントに渡されます
  const handleBet = async (amount: number) => {
    "use server";

    console.log(`${amount}ゴールドのベットを処理中...`);
    // 実際の処理を実装
    // ここでDBの更新などを行います

    // 成功したらリダイレクトやその他の処理
    return Promise.resolve();
  };

  return (
    <section className={styles.container}>
      <GoldBetCard balance={balance} onBet={handleBet} />
    </section>
  );
}
