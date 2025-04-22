import Link from "next/link";
import styles from "./Footer.module.scss";
import { ROUTE, ROUTE_NAME } from "@/constants";

/**
 * フッターコンポーネント
 * @returns フッターコンポーネント
 */
export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.copyright}>
          &copy; {currentYear} Type And Bet. All Rights Reserved.
        </div>
        <nav className={styles.links}>
          <Link href={ROUTE.TERMS} className={styles.link}>
            {ROUTE_NAME.TERMS}
          </Link>
          <Link href={ROUTE.PRIVACY} className={styles.link}>
            {ROUTE_NAME.PRIVACY}
          </Link>
          <Link href={ROUTE.CONTACT} className={styles.link}>
            {ROUTE_NAME.CONTACT}
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
