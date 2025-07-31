import { Card, Text } from "@/components/ui";

import styles from "./AuthCard.module.scss";

import type { AuthCardProps } from "./AuthCard.types";

/**
 * サーバコンポーネント
 * 認証用のカード
 * @returns 認証用のカード
 */
export const AuthCard = ({
  title,
  children,
}: AuthCardProps): React.ReactNode => {
  return (
    <div className={styles.wrapper}>
      <Card
        variant="default"
        backgroundColor="tertiary"
        isBorder={true}
        borderColor="tertiary"
        isRound={false}
        isHoverable={false}
        hasShadow={true}
        shadowColor="gold"
        padding="small"
        size="large"
        className={styles.authCard}
      >
        <div className={styles.authCard__container}>
          <Text
            variant="h3"
            size="large"
            color="gold"
            className={styles.authCard__title}
          >
            {title}
          </Text>
          {children}
        </div>
      </Card>
    </div>
  );
};

export default AuthCard;
