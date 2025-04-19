import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.scss";
import { Text } from "@/components/ui/Text";

export default function Home() {
  return (
    <>
      <div className={styles.page}>
        <Text variant="h1">1ページ目</Text>
        <Text variant="p">スクロールしてください</Text>
      </div>
      <div className={styles.page}>
        <Text variant="h1">2ページ目</Text>
        <Text variant="p">各ページは画面サイズの100%の高さです</Text>
      </div>
    </>
  );
}
