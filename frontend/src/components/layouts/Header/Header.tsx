import Image from "next/image";
import Link from "next/link";
import { type ReactElement } from "react";

import { Text } from "@/components/ui";
import { SITE_NAME } from "@/constants";

import styles from "./Header.module.scss";
import { HeaderActions } from "./HeaderActions";

/**
 * サーバコンポーネント
 * ヘッダーコンポーネント
 * @returns ヘッダーコンポーネント
 */
export const Header = (): ReactElement => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <Image
              src="/assets/images/logo.png"
              alt={SITE_NAME}
              width={70}
              height={70}
              priority
            />
          </Link>
          <Text variant="h1" className={styles.logo__text}>
            {SITE_NAME}
          </Text>
        </div>

        {/* クライアントコンポーネント */}
        <HeaderActions />
      </div>
    </header>
  );
};

export default Header;
